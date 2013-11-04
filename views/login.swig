{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <title>Login</title>
   <style>
      #register_link {
         margin-top: 3em;
         margin-left: 1em;
         font-weight: bold;
      }
   </style>
{% endblock %}

{% block body %}
{% parent %}
<form action="{{routes.post.AUTH}}" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>

<div id="register_link">
   Or <a href="{{routes.get.REGISTER}}">register</a> now.
</div>
{% endblock %}
