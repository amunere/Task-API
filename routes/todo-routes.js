const express = require('express');
const router = express.Router();
const TodoModel = require('../models/Todo');
const upload = require('../uploadMid/uploads');


/** get all todo */
router.get('/todo', (req, res) => {
  TodoModel.find({ user: req.user._id }).then(todos => {
    return res.json({
      todos: todos
    })
  })
    .catch((errors) => {
      return res.json({
        text: 'User not found'
      })
    })
}
);

/** get todo */
router.get('/todo/:id', (req, res) => {
  TodoModel.find({ _id: req.params.id }).then(todos => {
    if (req.user._id === todos[0].user) {
      return res.send({
        todos: todos
      })
    } else {
      return res.send({
        text: 'User not found'
      })
    }
  })
    .catch((errors) => {
      return res.send({
        text: 'Todo not found'
      })
    })
}
);


/** add todo */
router.post('/todo/add', upload.single('image'),
  (req, res) => {
    let errors = [];

    if (!req.body.title) {
      errors.push({
        text: 'Please add title'
      })
    }
    if (!req.body.description) {
      errors.push({
        text: 'Please add some description'
      })
    }
    if (!req.file) {
      req.file = ''
    }

    if (errors.length > 0) {
      res.json({
        errors: errors,
        title: req.body.title,
        description: req.body.description
      });
    } else {
      const newTask = {
        title: req.body.title,
        description: req.body.description,
        image: req.file.path,
        user: req.user._id,
        deadline: req.body.deadline,
        complete: false,
      };
      new TodoModel(newTask).save().then(todo => {
        res.json({
          todo: todo,
          success_msg: 'Task added'
        })
      })
        .catch((errors) => {
          res.json({
            text: 'This title has already been used'
          })
        })
    }
  }
);

/** edit todo */
router.put('/todo/:id', (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add title'
    })
  }
  if (!req.body.description) {
    errors.push({
      text: 'Please add some description'
    })
  }
  if (errors.length > 0) {
    return res.json({
      errors: errors,
      title: req.body.title,
      description: req.body.description
    });
  } else {
    TodoModel.findOne({ _id: req.params.id }).then(todo => {
      todo.title = req.body.title;
      todo.description = req.body.description;
      todo.image = req.body.image;
      todo.deadline = req.body.deadline;
      todo.complete = req.body.complete;
      todo.save().then(todo => {
        return res.json({
          todo: todo,
          success_msg: 'Task edited'
        })
      })
    })
      .catch((errors) => {
        return res.json({
          text: 'Check task ID'
        })
      })
  }
});

/** delete todo */
router.delete('/todo/:id', (req, res) => {
  TodoModel.deleteOne({
    _id: req.params.id
  }).then(() => {
    return res.json({
      success_msg: 'Task deleted'
    })
  })
    .catch((errors) => {
      return res.json({
        text: 'Check task ID'
      })
    })
});

module.exports = router;