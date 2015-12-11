var express = require('express');
var serveIndex = require('serve-index');
var ndjson = require('ndjson');
var concat = require('concat-stream');
var es = require('event-stream');

var sMsa = require('./streamMsa');
var propMatchRegex = sMsa.propMatchRegex;
var getProteinSeqs = sMsa.getProteinSeqs;

var app = express();

// app.use('/data', serveIndex('data'));
// app.use('/data', express.static('data'));

app.use(express.static('public'));

app.get('/aligned', [
    function (req, res, next) {
        req.opts = {
            query: 'mbp1',
            vars: {
                species: []
            },
            filters: [
                function(obj) {
                    return propMatchRegex(obj, 'title', /^mbp1p?.*\[.*\]$/i);
                }
            ],
            uniqueSpecies: true
        };

        next();
    },
    getProteinSeqs
]);


app.listen(3000);

console.log('Express server listening on port 3000');
