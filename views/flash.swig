{% extends 'master.swig' %}
{# 
   To be used as a base template for anything that wants to show
   flash() error messages at the top of body
#}

{% block head %}
{% parent %}
{% endblock %}

{% block body %}
{% parent %}
{% if flash %}
   <div class="flash-error">
      {% for err in flash %}
      <p>
         {{err}}
      </p>
      {% endfor %}
   </div>
{% endif %}
{% endblock %}
