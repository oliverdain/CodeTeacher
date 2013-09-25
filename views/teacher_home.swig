{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Teacher Home Page</title>
   
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
   <link rel=stylesheet href="/stylesheets/home.css">
{% endblock %}

{% block body %}
{% parent %}
<h1>Home Page for {{fullname}}</h1>

<h2>Assignments To Grade</h2>
<table>
   <thead>
      <tr>
         <td>
            Student Name
         </td>
         <td>
            Submitted Date and Time
         </td>
         <td>
            Action
         </td>
      </tr>
   </thead>
   <tbody>
      {% for idx, assign in needGrading %}
      <tr>
         <td>
            {{ assign.fullname }}
         </td>
         <td>
            {{ assign.submitted_datetime }}
         </td>
         <td>
            Grade Assignment
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>
{% endblock %}
