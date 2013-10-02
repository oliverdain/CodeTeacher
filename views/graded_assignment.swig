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

Comments:
<div id="assign_comments">
   {{ grade.comments }}
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
