{% extends 'flash.swig' %}

{% block head %}
   {% parent %}
   <script src="javascript/third_party/jquery-1.9.1.min.js"></script>
{% endblock %}

{% block body %}
{% parent %}
<form action="{{routes.post.REGISTER}}" method="post" id="reg_form">
    <div>
        <label>Username:
           <input type="text" name="username" id="username"/>
        </label>
    </div>
    <div>
       <label>Full Name:
          <input type="text" name="fullname" id="fullname"/>
       </label>
    <div>
    <div>
       <label>email:
          <input type="text" name="email" id="email"/>
       </label>
    <div>
    <div>
        <label>Password:
           <input type="password" name="password" id="password"/>
        </label>
    </div>
    <div>
        <label>Confirm Password:
           <input type="password" name="c_password" id="c_password"/>
        </label>
    </div>
    <div>
        <input type="submit" id="reg_button" value="Register"/>
    </div>
</form>
<script src="javascript/register.js"></script>
{% endblock %}
