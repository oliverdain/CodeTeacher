var showDialog = function(dialogId) {
  $('#' + dialogId).dialog('open');
}

$(document).ready(function() {
  $('.dialog').dialog({
    autoOpen: false,
    modal: true,
    buttons: {
      'Submit': function() {
        var url = $(this).find('input[name=url]').val();
        if (url.length > 0) {
          $(this).find('form').submit();
        } else {
          alert('URL must not be empty.');
        }
      },
      'Close': function() {
        $(this).dialog('close');
      }
    }
  });
});
