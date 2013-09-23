{% extends 'master.swig' %}

{% block head %}
   {% parent %}
   <title>Assignement Code Review</title>
   <script src="/javascript/third_party/jquery-1.9.1.min.js"></script>
   <script src="/javascript/third_party/rainbow-custom.min.js"></script>
   <script src="/javascript/third_party/underscore-min.js"></script>

   <script src="/javascript/review.js"></script>

   <link rel=stylesheet href="/stylesheets/third_party/rainbow/github.css">
   <link rel=stylesheet href="/stylesheets/review.css">
{% endblock %}

{%block body %}
   {% parent %}
   <div id="header">
      <h1>Code Review</h1>
   </div>
   <div id="main">
   </div>
{% endblock %}
