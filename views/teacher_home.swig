{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Teacher Home Page</title>
   
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
   <script src="/javascript/third_party/jquery-ui-1.10.3.custom.min.js"></script>
   <script src="/javascript/third_party/underscore-min.js"></script>
   <script src="/javascript/teacher_home.js"></script>

   <link rel=stylesheet href="/stylesheets/third_party/jquery-ui/smoothness/jquery-ui-1.10.3.custom.min.css">
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
            Assignment
         </td>
         <td>
            Assignment Due Date
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
            {{ assign.name }}
         </td>
         <td>
            {{ assign.due_datetime }}
         </td>
         <td>
            {{ assign.submitted_datetime }}
         </td>
         <td>
            <form action="{{ routes.post.CREATE_CR }}" method="POST">
               <input type="hidden" value="{{ assign.uname }}" name="uname">
               <input type="hidden" value="{{ assign.assignment_id }}" name="assign_id">
               <input type="hidden" value="{{ assign.name }}" name="assign_name">
               <input type="submit" value="Grade Assignment">
            </form>
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>



<h2>Users</h2>
<table>
   <thead>
      <tr>
         <td>
            Name
         </td>
         <td>
            User Name
         </td>
         <td>
            Action
         </td>
      </tr>
   </thead>
   <tbody>
      {% for idx, user in allUsers %}
      <tr>
         <td>
            {{ user.fullname }}
         </td>
         <td>
            {{ user.uname }}
         </td>
         <td>
            <button onclick="resetPassword('{{ user.uname }}')"
               class="pwd-reset">
               Reset Password
            </button>
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>

<p>
   <a href="{{ routes.get.LOGOUT }}">Log Off</a>
</p>
{% endblock %}
