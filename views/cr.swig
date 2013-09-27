{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
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
      </tr>
   </thead>
   <tbody id="cr_files">
   </tbody>
</table>

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
   var $row = $('<tr/>');
   var $col = $('<td/>');
   $col.append($('#fname').val());
   $row.html($col);
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
