var submitNewPass = function(uname, $newPass, $dialog) {
  $.post('/pass_reset', {uname: uname, newPass: $newPass.val()},
      function( data ) {
        if (data === 'SUCCESS') {
          alert('Password Reset');
          $dialog.dialog('close');
        } else {
          alert('Error trying to reset the password for ' + uname + '\n' + data);
        }
      })
  .fail(function() {
    alert('Error trying to reset password for ' + uname);
  });
};

var resetPassword = function(uname) {
  $dialogDiv = $('<div/>');
  $newPass = $('<input>', {type: 'password'});
  $dialogDiv.append('New Password: ');
  $dialogDiv.append($newPass);
  $dialogDiv.dialog({
    modal: true,
    buttons: [
      {
        text: "Submit",
        click: _.partial(submitNewPass, uname, $newPass, $dialogDiv)
      },
      {
        text: "Cancel",
        click: function() { $(this).dialog('close'); }
      }
    ]
  });
};

$(document).ready(function() {
});
