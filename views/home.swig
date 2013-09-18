{% extends 'master.swig' %}

{% block head %}
   {% parent %}
{% endblock %}

{% block body %}
{% parent %}
<h1>Welcome to your home page!</h1>

<h2>Start a New Project</h2>
<form action="{{routes.post.NEW_PROJ}}" method="post">
   <div>
      <label>Name:
         <input type="text" name="proj_name">
      </label>
   </div>
   <div>
      <label>Description:
         <textarea name="description"></textarea>
      </label>
   </div>
   <div>
      <input type="submit" value="Create">
   </div>
</form>
{% endblock %}
