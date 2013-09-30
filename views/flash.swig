{% extends 'master.swig' %}
{# 
   To be used as a base template for anything that wants to show
   flash() error messages at the top of body
#}

{% block head %}
{% parent %}
<script>
   var flashError = function(err) {
      console.log('Flashing error message:');
      console.dir(err);
      var $p = $('<p/>');
      $p.text(err.toString());
      $('#flash_error').append($p);
      $('#flash_error').addClass('show-flash').removeClass('hide-flash');
   };

   var clearErrorFlash = function() {
      $('#flash_error').html('');
      $('#flash_error').addClass('hide-flash').removeClass('show-flash');
   }
</script>
{% endblock %}

{% block body %}
{% parent %}
{% if flash %}
   {% set flash_class = "show-flash" %}
{% else %}
   {% set flash_class = "hide-flash" %}
{% endif %}
<div class="flash-error {{flash_class}}" id="flash_error">
   {% for err in flash %}
   <p>
      {{err}}
   </p>
   {% endfor %}
</div>

{% endblock %}
