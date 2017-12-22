var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  req.db.collection('shopify').find({}).toArray(function(err, results){
    console.log("results:", results)

    var items = [];
    results.map((result, index) => {
      console.log(result)
      Object.keys(result.items).map((key, index) => {
        items.push(result.items[key]);
      })
    });

    console.log("items:", items);
    res.render('index', {
      user: req.user,
      items: items
    });

  });
});

module.exports = router;
