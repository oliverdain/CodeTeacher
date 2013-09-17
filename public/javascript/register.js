$(document).ready(function() {
  $('#reg_form').submit(function() {
    var errors =  [];
    var $form = $('#reg_form');

    var uname = $form.find('#username').val().trim();
    if (uname.length === 0) {
      errors.push('Username can not be blank');
    }

    var p1 = $form.find('#password').val().trim();
    var p2 = $form.find('#c_password').val().trim();
    if (p1.length === 0) {
      errors.push('Password can not be blank');
    }
    if (p1 !== p2) {
      errors.push('Passwords do not match');
    }

    if (errors.length > 0) {
      var htmlErrors = [];
      $.each(errors, function(i, val) {
        htmlErrors.push($('<p/>', {text: val}))
      });
      $('#flash_error').html(htmlErrors);
      $('#flash_error').addClass('show-flash').removeClass('hide-flash');
      return false; 
    } else {
      return true;
    }
  });
});
