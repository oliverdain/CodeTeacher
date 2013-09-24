{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Home Page</title>
   <link rel=stylesheet href="/stylesheets/home.css">
{% endblock %}

{% block body %}
{% parent %}
<h1>Home Page for {{fullname}}</h1>

<h2>Assignments To Do</h2>
{% if notstarted && notstarted.length > 0 %}
<table>
   <thead>
      <tr>
         <td>
            Name
         </td>
         <td>
            Due Date
         </td>
         <td>
            Action
         </td>
      </tr>
   </thead>
   <tbody>
      {% for idx, assign in notstarted %}
      <tr>
         <td>
            <a href="{{ assign.template_url }}">
               {{ assign.name }}
            </a>
         </td>
         <td>
            {{ assign.due_datetime|date('m/d/Y') }}
         </td>
         <td>
            <button data-assign="{{ assign.id }}" class="submit-assign">
               Submit Assignment
            </button>
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>
{% else %}
None.
{% endif %}

<h2>Submitted Assignments</h2>
{% if submitted && submitted.length > 0 %}
<table>
   <thead>
      <tr>
         <td>
            Name
         </td>
         <td>
            Submitted Date
         </td>
      </tr>
   </thead>
   <tbody>
      {% for idx, assign in submitted %}
      <tr>
         <td>
            <a href="{{ assign.submitted_url }}">
               {{ assign.name }}
            </a>
         </td>
         <td>
            {{ assign.submitted_datetime|date('m/d/Y') }}
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>
{% else %}
None.
{% endif %}

<h2>Graded Assignments</h2>
None.

<div id="links">
   <h2>Useful Links</h2>

   <h3>Code Editor</h3>
   <a href="http://codio.com">Codio</a>

   <h3>HTML References</h3>
   <ul>
      <li><a href="http://reference.sitepoint.com/html">Sitepoint</a></li>
      <li><a href="http://htmldog.com/reference/htmltags/">HTMLDog</a></li>
   </ul>

   <h3>CSS References</h3>
   <ul>
      <li><a href="http://reference.sitepoint.com/css">Sitepoint</a></li>
      <li><a href="http://htmldog.com/reference/cssproperties/">HTMLDog</a></li>
   </ul>
</div>

{% endblock %}
