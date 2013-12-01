#!/usr/bin/env node

var DEFAULT_PORT = 4000;

var util = require('util'),
    fs = require('fs'),
    url = require('url'),
    express = require('express');

var app = express();
app.disable('quiet');

express.limit('10mb');
app.configure(function() {  
  app.use(express.bodyParser());          
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'jimbo' }));
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(__dirname + '/public'));
});

var appHelpers = {};
appHelpers.sendFile = function(pathname, res) {
    util.puts('sending: ' + pathname);
    var file = fs.createReadStream(pathname);
    file.on('data', res.write.bind(res));
    file.on('close', function () {
        res.end();
    });
    file.on('error', function (error) {
        util.puts(error);
    })
};
   
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('*.*', function (req, res) {  
    appHelpers.sendFile('.' + req.url, res);
});

app.get('*', function (req, res) {
    appHelpers.sendFile(__dirname + '/index.html', res);
});


var server;
server = app.listen(DEFAULT_PORT);
console.log('Server running at http://127.0.0.1:4000/');  
