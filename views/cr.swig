{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>

   <style>
      #grade_form_wrapper {
         background-color: #E9E9DF;
         padding: 2em;
         box-shadow: 10px 10px 5px #888888;
         position: fixed;
         right: 2em;
         top: 2em; 
      }

      .hidden {
         display: none;
      }

      #grade_submit_result {
         border: 1px solid #000;
         width: auto;
         padding: 0.25em;
         margin-top: 1em;
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
<p>
   Submitted URL: <a href="{{ submitted.submitted_url }}">
      {{ submitted.submitted_url }}
   </a>
</p>
<p>
   Submitted Time: {{ submitted.submitted_datetime }}
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
      {% for f in files %}
         <tr>
            <td>
               {{ f.file_name }}
            </td>
            <td>
               <a href="{{ routes.get.FILE_REVIEW }}{{ student.uname }}/{{ assign.id }}/{{ f.file_name }}">Review</a>
            </td>
         </tr>
      {% endfor %}
   </tbody>
</table>

<div id="grade_form_wrapper">
<h2>Submit Grade</h2>
<form id="grade_form">
   <textarea cols="50" rows="10" name="comments">{{ grade.comments }}</textarea>
   <br>
   <input type="hidden" value="{{ student.uname }}" name="uname">
   <input type="hidden" value="{{ submitted.assignment_id }}" name="assign_id">
   <label for="grade">Grade:</label>
   <input type="text" id="grade" name="grade" value="{{ grade.grade }}">
   <input type="submit" value="Submit" id="submit_grade_btn">
</form>
<div id="grade_submit_result" class="hidden"></div>
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

var submitGrade = function() {
   $inputs = $('#grade_form :input');
   data = {};
   $inputs.each(function(idx) {
      if (this.type === 'submit') {
         return;
      }
      data[this.name] = this.value;
   });
   console.log('Submitting grade data: ', data);
   $.post('{{ routes.post.SUBMIT_GRADE }}', data,
      onGradeSubmitted).fail(onGradeError);
   // So the form isn't actually submitted
   return false;
};

var onGradeSubmitted = function(res) {
   $('#grade_submit_result').text(res).removeClass('hidden');
};

var onGradeError = function(err) {
   $('#grade_submit_result').text(err).removeClass('hidden');
};

$(document).ready(function() {
   $('#add_code_btn').click(addCode);
   $('#grade_form').submit(submitGrade);
   $('#grade_form').change(function() {
      $('#grade_submit_result').addClass('hidden');
   });
});

</script>
{% endblock %}
