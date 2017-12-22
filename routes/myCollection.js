var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("My shopping");
  if(req.user){
    console.log("My shopping");
    req.db.collection('shopify').find({userId: req.user._json.sub}).toArray(function(err, results){
      var items = [];
      results.map((result, index) => {

        Object.keys(result.items).map((key, index) => {
          items.push(result.items[key]);
        })
      });

      console.log("items:", items);
      res.render('myCollection', {
        user: req.user,
        items: items
      });
    });
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
