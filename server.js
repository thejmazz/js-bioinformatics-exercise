var express = require('express');
var serveIndex = require('serve-index');

var app = express();

app.use('/data', serveIndex('data'));
app.use('/data', express.static('data'));

app.use(express.static('public'));

app.listen(3000);

console.log('Express server listening on port 3000');
