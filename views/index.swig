{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Editor</title>
   <script src="javascript/third_party/jquery-1.9.1.min.js"></script>

   <script src="javascript/third_party/codemirror/codemirror.js"></script>
   <script src="javascript/third_party/codemirror/mode/xml/xml.js"></script>
   <script src="javascript/third_party/codemirror/mode/javascript/javascript.js"></script>
   <script src="javascript/third_party/codemirror/mode/css/css.js"></script>
   <script src="javascript/third_party/codemirror/mode/htmlmixed/htmlmixed.js"></script>
   <link rel=stylesheet href="stylesheets/third_party/codemirror.css">

   <style type=text/css>
      .CodeMirror {
        width: 45%;
        border: 1px solid black;
      }
      #preview {
         width: 45%;
         border: 1px solid black;
      }
    </style>
{% endblock %}

{%block body %}
   {% parent %}
   <div>
      <textarea id="html-code" name="html-code">
      </textarea>
      <iframe id="preview"></iframe>
   </div>
   <input type="button" value="Preview" id="preview-button"></input>



   <script>
      var editor = CodeMirror.fromTextArea(
         document.getElementById('html-code'),
         {
            mode: 'htmlmixed',
            tabMode: 'indent'
         });

      $prevButton = $('#preview-button');

      $prevButton.bind('click', function() {
         var previewFrame = $('#preview')[0];
         var contents = previewFrame.contentDocument ||
            previewFrame.contentWindow.document;
         contents.open();
         contents.write(editor.getValue());
         contents.close();
      });
   </script>

{% endblock %}
