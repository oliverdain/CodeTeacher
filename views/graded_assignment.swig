{% extends 'master.swig' %}
{% block head %}
   {% parent %}
   <style>
      #assign_comments {
         margin: 1em;
         background-color: #BEBABA;
      }
      </style>
{% endblock %}

{% block body %}
{% parent %}
<h1>Grade for {{ assign.name }}</h1>

Submitted URL: <a href="{{ submitted.submitted_url }}">{{ submitted.submitted_url }}</a>

<h2>Comments:</h2>
<div id="assign_comments">
   {{ grade.comments|escape|replace('\n', '<br>', 'g')|safe }}
</div>
Grade: <span id="grade">{{ grade.grade }}</span>

<h2>Files</h2>
<ul>
   {% for i, f in files %}
   <li>
      <a href="{{ routes.get.FILE_REVIEW }}{{ uname }}/{{ assign_id }}/{{ f.file_name }}">
         {{ f.file_name}}
      </a>
   </li>
   {% endfor %}
</ul>


{% endblock %}
