$(function() {
  console.log('local.js ready');

  initialPostButton();
  initialCanelPostButton();

  function initialPostButton() {
    console.log("initial post button");
    $('#post-shopping').on('click', function(e) {
      e.preventDefault();
      var f = $('#theinputfield')[0].files[0];

      if (!f) {
        alert('pick a file');
        return;
      }

      var fd = new FormData();
      fd.append('ajaxfile', f);

      console.log("....");

      $.ajax({
        url: '/createShopping/uploading',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function(res) {

          console.log('res:', res);
          $title = $('#item-title');
          $price = $('#item-price');
          $description = $('#product-description');
          var itemData = {
            title: $title.val(),
            price: $price.val(),
            description: $description.val(),
            imageId: res.imageId
          };

          var itemDataString = JSON.stringify(itemData);

          if(itemDataString) {
              $.post( "/createShopping/uploading-all-data", {data: itemDataString})
              .done(function( res ) {
              });
          }
          location.replace('/');
        }
      });
    });
  }

  function initialCanelPostButton() {
    $('#delete-posting').on('click', function(e){
      e.preventDefault();
      location.replace('/');
    })
  }
});
