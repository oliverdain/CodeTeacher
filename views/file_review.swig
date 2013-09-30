{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <title>Assignement Code Review</title>
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
   <script src="/javascript/third_party/rainbow-custom.min.js"></script>
   <script src="/javascript/third_party/underscore-min.js"></script>

   <script src="/javascript/review.js"></script>

   <link rel=stylesheet href="/stylesheets/third_party/rainbow/github.css">
   <link rel=stylesheet href="/stylesheets/review.css">
{% endblock %}

{%block body %}
   {% parent %}
   <div id="header">
      <h1>Code Review</h1>
   </div>
   <div id="main">
   </div>

   <script>
      var saveComments = function(comments) {
         console.log('I will save:');
         console.dir(comments);
      };

      var reviewRetrieved = function(rData) {
         console.log('File review data retrieved.:');
         console.dir(rData);
         $codeDiv = $('#main');
         // TODO(odain) Pass in any existing comments.
         var rWidget = new CodeReview(
               rData.code, rData.comment_blocks, saveComments, $codeDiv);
      };
      
      $(document).ready(function() {
         $.getJSON('{{ routes.get.FILE_REVIEW_CONTENT }}' +
            '{{ review.uname }}/{{ review.assign_id }}/{{ review.fname }}')
         .success(reviewRetrieved)
         .fail(function(err) {
            var $p = $('<p/>');
            $p.text(err.toString());
            $('#flash_error').append($p);
            $('#flash_error').addClass('show-flash').removeClass('hide-flash');
         });
      });
   </script>
{% endblock %}
