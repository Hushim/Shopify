var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;

var multer  = require('multer')
var multerGridFs = require('multer-gridfs-storage');

// use this for sending files to browser from gridfs
var Gridfs = require('gridfs-stream');

// to store in mongodb (GridFS):
const multerGridFsStorage = multerGridFs({
   url: process.env.DB_URI
});

var upload = multer({ storage: multerGridFsStorage });

router.get('/', function(req, res, next) {
  if(req.user){
    var postUser = req.user.displayName;
    //console.log('user info:', req.user);
    res.render('createShopping', {
      user: req.user
    });

  } else {
    res.redirect("/login");
  }
});

router.post('/uploading', upload.single('ajaxfile'), function(req, res, next){
  res.json({imageId: req.file.id});
});

router.post('/uploading-all-data', function(req, res, next){
  var itemData = JSON.parse(req.body.data);
  var itemId = itemData.imageId;
  var userInfo = req.user;
  var userId = userInfo._json.sub;
  itemData["userInfo"] = userInfo;

  console.log('user:', userId);
  req.db.collection('shopify').find({userId: userId}).toArray(function(err, results) {
    if(results.length === 0) {
      var item = {};
      item["userId"] = userId;
      item["items"] = {};
      item["items"][itemId] = itemData;
      item["userInfo"] = userInfo;

      req.db.collection('shopify').insertOne(item);
    } else {
      //console.log(results);
      results[0].items[itemId] = itemData;

      var updateReq = { userId: results[0].userId};
      var newData = { $set: { items: results[0].items} };
      req.db.collection('shopify').updateOne(updateReq, newData, function(err, res) {
        console.log('res:', res);
      });
    }
  });
});

module.exports = router;
