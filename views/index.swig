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

   <script src="javascript/third_party/jquery-ui-1.10.3.custom.min.js"></script>
   <link rel=stylesheet href="stylesheets/third_party/jquery-ui/smoothness/jquery-ui-1.10.3.custom.min.css">

   <style type=text/css>
      .CodeMirror {
        width: 100%;
        border: 1px solid black;
      }
      #preview {
         width: 100%;
         border: 1px solid black;
      }
    </style>
{% endblock %}

{%block body %}
   {% parent %}
   <div id="editor-tabs">
      <ul>
         <li><a href="#editor-wrap">HMTL</a></li>
         <li><a href="#preview-wrap">Output</a></li>
      </ul>
      <div id="editor-wrap">
         <textarea id="html-code" name="html-code">
         </textarea>
      </div>
      <div id="preview-wrap">
         <iframe id="preview"></iframe>
      </div>
   </div>

   <script>
      var handleTabChange = function(event, ui) {
         if (ui.newPanel.selector === '#preview-wrap') {
            console.debug('Updating the preview!');
            var previewFrame = $('#preview')[0];
            var contents = previewFrame.contentDocument ||
               previewFrame.contentWindow.document;
            contents.open();
            contents.write(editor.getValue());
            contents.close();
         }
      }

      $(document).ready(function() {
         $('#editor-tabs').tabs({
            activate: handleTabChange
         });
      });

      var editor = CodeMirror.fromTextArea(
         document.getElementById('html-code'),
         {
            mode: 'htmlmixed',
            tabMode: 'indent'
         });
   </script>

{% endblock %}
