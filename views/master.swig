{# Basic shared layout used by all other templates #}
<!doctype html>
<html>
   <head>
      <meta charset="utf-8">
      {% block head %}
      <script src="javascript/console-fix.js"></script>
      <link type="text/css" href="stylesheets/common.css" rel="Stylesheet" />
      {% endblock %}
   </head>
   <body>
     {% block body %}
     {% endblock %}
   </body>
</html>

