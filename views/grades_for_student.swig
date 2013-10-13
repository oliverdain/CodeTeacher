{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
{% endblock %}

{% block body %}
{% parent %}
<h1>Grades for {{ fullname }}</h1>

<table>
   <thead>
      <tr>
         <td>
            Assignment
         </td>
         <td>
            Submitted URL
         </td>
         <td>
            Assignment Due
         </td>
         <td>
            Assignment Submitted
         </td>
         <td>
            Grade
         </td>
      </tr>
   </thead>
   <tbody>
      {% for i, g in grades %}
      <tr>
         <td>
            <a href="{{ routes.get.GRADED_ASSIGN }}{{ uname }}/{{ g.assignment_id }}">
               {{ g.name }}
            </a>
         </td>
         <td>
            <a href="{{ g.submitted_url }}">{{ g.submitted_url }}</a>
         </td>
         <td>
            {{ g.due_datetime }}
         </td>
         <td>
            {{ g.submitted_datetime }}
         </td>
         <td>
            {{ g.grade }}
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>

{% endblock %}
