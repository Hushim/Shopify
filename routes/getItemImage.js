var express = require('express');
var router = express.Router();

var co = require('co');

var mongodb = require('mongodb');

// add multer lib to support file uploads
var multer  = require('multer')
var multerGridFs = require('multer-gridfs-storage');

// use this for sending files to browser from gridfs
var Gridfs = require('gridfs-stream');

const multerGridFsStorage = multerGridFs({
   url: process.env.DB_URI
});
var upload = multer({ storage: multerGridFsStorage });


router.get('/:fileId', function(req, res, next) {
  var gfs = Gridfs(req.db, mongodb);
  var readstream = gfs.createReadStream({
    _id: req.params.fileId
  });
  return readstream.pipe(res);
});

module.exports = router;
