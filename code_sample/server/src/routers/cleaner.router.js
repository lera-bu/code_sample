const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

const upload = multer({ storage });

const cleanerRouter = express.Router();

const {
  cleanerLogin,
  cleanerRegister,
  cleanersList,
  cleanerInfo,
  cleanerPhoto,

} = require('../controllers/cleaner.controller');

module.exports = cleanerRouter
  .post('/login', cleanerLogin)
  .post('/register', cleanerRegister)
  .get('/', cleanersList)
  .get('/info', cleanerInfo)
  .post('/updatePhoto/:id', upload.single('image'), cleanerPhoto);
