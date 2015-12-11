var express = require('express');
var serveIndex = require('serve-index');
var ndjson = require('ndjson');
var concat = require('concat-stream');
var es = require('event-stream');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var sMsa = require('./streamMsa');
var propMatchRegex = sMsa.propMatchRegex;
var getProteinSeqs = sMsa.getProteinSeqs;

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// app.use('/data', serveIndex('data'));
// app.use('/data', express.static('data'));

app.use(express.static('public'));

// e.g. /aligned?q=mbp1
app.get('/aligned', [
    function (req, res, next) {
        req.opts = {
            query: req.query.q,
            vars: {
                species: []
            },
            filters: [
                function(obj) {
                    // return propMatchRegex(obj, 'title', /^mbp1p?.*\[.*\]$/i);
                    var regex = new RegExp('^' + req.query.q + '.*\\[.*\\]$', 'i');
                    return propMatchRegex(obj, 'title', regex);
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
