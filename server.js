var express = require('express');
var serveIndex = require('serve-index');

var app = express();

app.use(serveIndex('data'));
app.use(express.static('data'));

app.listen(3000);

console.log('Express server listening on port 3000');
