const multer = require('multer');
const fs = require('fs');
const path = require('path'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./app/src/website";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
