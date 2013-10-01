{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>

   <style>
      #grade_form {
         background-color: #E9E9DF;
         padding: 2em;
         box-shadow: 10px 10px 5px #888888;
         position: fixed;
         right: 2em;
         top: 2em; 
      }
   </style>
{% endblock %}

{% block body %}
{% parent %}
<h1>Create Code Review</h1>
<p>
   Assignment: {{ assign.name }}
</p>
<p>
   Student: {{ student.fullname }}
</p>

<h2>Files in Review</h2>
<table>
   <thead>
      <tr>
         <td>
            File Name
         </td>
         <td>
            Action
         </td>
      </tr>
   </thead>
   <tbody id="cr_files">
   </tbody>
</table>

<div id="grade_form">
<h2>Submit Grade</h2>
<form method="post" action="{{ routes.post.SUBMIT_GRADE }}">
   <textarea cols="80" rows="10" name="comments"></textarea>
   <br>
   <label for="grade">Grade:</label>
   <input type="text" id="grade" name="grade">
   <input type="submit" value="Submit">
</form>
</div>

<h2>Add Code</h2>

<div>
   File Name: <input type="text" id="fname"><br>
   <textarea name="code" id="code" rows="30" cols="80">
   </textarea>
   <br>
   <button id="add_code_btn">Add</button>
</div>

<script>

var onCodeSubmit = function(res) {
   console.assert(res === 'SUCCESS');
   var fname = $('#fname').val();
   var $row = $('<tr/>');
   var $colFile = $('<td/>');
   $colFile.append(fname);
   $row.html($colFile);

   var $colAction = $('<a/>', {
      href: '{{ routes.get.FILE_REVIEW }}{{ student.uname }}/{{ assign.id }}/' + fname
   });
   $colAction.append('Review');
   $row.append($colAction);

   $('#cr_files').append($row);
   $('#code').val('');
   $('#fname').val('');
};

var onCodeSubmitFail = function(err) {
   alert('Error submitting code: ' + err);
}

var addCode = function() {
   $.post('{{ routes.post.ADD_CODE_TO_REVIEW }}',
         {
            assign_id: {{ assign.id }},
            uname: '{{ student.uname }}',
            code: $('#code').val(),
            fname: $('#fname').val()
         }, onCodeSubmit).fail(onCodeSubmitFail);
};

$(document).ready(function() {
   $('#add_code_btn').click(addCode);
});

</script>
{% endblock %}
