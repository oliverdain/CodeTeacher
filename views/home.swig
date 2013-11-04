{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Home Page</title>
   
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
   <script src="/javascript/third_party/jquery-ui-1.10.3.custom.min.js"></script>
   <script src="/javascript/home.js"></script>

   <link rel=stylesheet href="/stylesheets/third_party/jquery-ui/smoothness/jquery-ui-1.10.3.custom.min.css">
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
            <button onclick="showDialog('dialog-{{ assign.id }}')">
               Submit Assignment
            </button>
            <div class="dialog" id="dialog-{{ assign.id }}">
               <form method="post" action="{{ routes.post.SUBMIT_ASSIGN }}">
                  <input type="hidden" value="{{ assign.id }}" name="assign_id">
                  URL: <input type="text" name="url">
               </form>
            </div>
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
         <td>
            Action
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
            {{ assign.submitted_datetime }}
         </td>
         <td>
            <button onclick="showDialog('resubmit-dialog-{{ assign.id }}')">
               Change Submitted URL
            </button>
            <div class="dialog" id="resubmit-dialog-{{ assign.id }}">
               <form method="post" action="{{ routes.post.RESUBMIT_ASSIGN }}">
                  <input type="hidden" value="{{ assign.id }}" name="assign_id">
                  URL: <input type="text" name="url">
               </form>
            </div>
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>
{% else %}
None.
{% endif %}

<h2>Graded Assignments</h2>
{% if graded && graded.length > 0 %}
<table>
   <thead>
      <tr>
         <td>
            Name
         </td>
         <td>
            Grade
         </td>
      </tr>
   </thead>
   <tbody>
      {% for idx, assign in graded %}
      <tr>
         <td>
            <a href="{{ routes.get.GRADED_ASSIGN }}{{ uname }}/{{ assign.assignment_id }}">
               {{ assign.name }}
            </a>
         </td>
         <td>
            {{ assign.grade }}
         </td>
      </tr>
      {% endfor %}
   </tbody>
</table>
{% else %}
None.
{% endif %}

<div id="links">
   <h2>Useful Links</h2>

   <h3>Code Editor</h3>
   <a href="http://codio.com">Codio</a>

   <h3>HTML References</h3>
   <ul>
      <li><a href="http://www.w3.org/community/webed/wiki/HTML/Elements">W3C</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">Mozilla DN</a></li>
      <li><a href="http://reference.sitepoint.com/html">Sitepoint</a></li>
      <li><a href="http://htmldog.com/reference/htmltags/">HTMLDog</a></li>
   </ul>

   <h3>CSS References</h3>
   <ul>
      <li><a href="http://www.w3.org/community/webed/wiki/CSS/Properties">W3C Properties Reference</a></li>
      <li><a href="http://www.w3.org/community/webed/wiki/CSS/Selectors">W3C Selectors Reference</a></li>
      <li><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference">Mozilla DN</a></li>
      <li><a href="http://reference.sitepoint.com/css">Sitepoint</a></li>
      <li><a href="http://htmldog.com/reference/cssproperties/">HTMLDog</a></li>
   </ul>

   <h3>Validation Services</h3>
   <ul>
      <li><a href="http://validator.w3.org/">W3C HTML Validator</a></li>
      <li><a href="http://jigsaw.w3.org/css-validator/">W3C CSS Validator</a></li>
   </ul>

   <div id="logout-block">
      <a href="{{ routes.get.LOGOUT }}">Log Off</a>
   </div>
</div>

{% endblock %}
