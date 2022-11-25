const multer = require('multer');

/** storage image Multer */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

/** Multer image uploads sets */
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  storage: storage
});

module.exports = upload