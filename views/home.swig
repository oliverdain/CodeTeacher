{% extends 'master.swig' %}

{% block head %}
   {% parent %}
{% endblock %}

{% block body %}
{% parent %}
<h1>Welcome to your home page!</h1>

<input type="button" value="Start New Project"></input>
{% endblock %}
