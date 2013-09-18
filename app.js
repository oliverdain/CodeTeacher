
/**
 * Module dependencies.
 */

var express = require('express');
var routeSetup = require('./routes/setup');
var http = require('http');
var path = require('path');
var swig = require('swig');
var verbs = require('./routes/verbs');
var flash = require('connect-flash');

var app = express();

app.engine('swig', swig.renderFile);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'swig');
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(flash());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'LASNFQU#$%)*@J'}));
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  // Disable the swig cache so templates are always re-rendered
  swig.setDefaults({ cache: false });
}

verbs.init(app);

routeSetup.setup(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
