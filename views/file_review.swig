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
      <h1>Code Review for {{ review.fname }}</h1>
   </div>
   <div id="main">
   </div>

   <script>
      var EXTENSION_MAP = {
         'html': 'html',
         'css': 'CSS',
         'js': 'Javascript'
      };

      var saveComments = function(comments) {
         var postUrl = '{{ routes.post.SAVE_CR_COMMENTS }}{{ review.uname }}/' +
            '{{ review.assign_id }}/{{ review.fname }}';
         $.post(postUrl, {comments: comments})
            .success(function(res) {
               console.assert(res === 'SUCCESS');
               console.debug('Comments saved to server');
            })
            .fail(function(err) {
               console.log('Error saving comments:');
               console.dir(err);
               flashError('Unable to save comments to server: ' + err.responseText);
            });
      };

      var reviewRetrieved = function(rData) {
         console.log('File review data retrieved.:');
         console.dir(rData);
         $codeDiv = $('#main');
         var saveCb = null;
         if ('{{ role }}' === 'teacher') {
            saveCb = saveComments;
         }
         var extension = '{{ review.fname }}'
         extension = extension.split('.').slice(-1)[0];
         extension = extension.toLowerCase();
         var lang = EXTENSION_MAP[extension];

         var rWidget = new CodeReview(
            rData.code, lang, JSON.parse(rData.comment_blocks),
            saveCb, $codeDiv);
      };
      
      $(document).ready(function() {
         $.getJSON('{{ routes.get.FILE_REVIEW_CONTENT }}' +
            '{{ review.uname }}/{{ review.assign_id }}/{{ review.fname }}')
         .success(reviewRetrieved)
         .fail(function(err) {
            console.log('Error retrieving code review:');
            console.dir(err);
            flashError('Unable to retrieving code review: ' + err.responseText);
         });
      });
   </script>
{% endblock %}
