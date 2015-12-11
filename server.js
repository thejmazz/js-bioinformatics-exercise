var express = require('express');
var serveIndex = require('serve-index');
var ndjson = require('ndjson');
var concat = require('concat-stream');
var es = require('event-stream');
var fs = require('fs');

var app = express();

// app.use('/data', serveIndex('data'));
// app.use('/data', express.static('data'));

app.use(express.static('public'));

app.get('/aligned', function(req, res, next) {
    // Using sketchy callback-esque technique since concat-stream was throwing errors..
    var alignedSeqs = 'outputs/seqsAligned.ndjson';
    // Assumes newline at end of file..
    numLines = (fs.readFileSync(alignedSeqs, 'utf8')).split('\n').length - 1;

    var seqs = [];

    var trySend = function(sequence) {
        seqs.push(sequence);
        if (seqs.length === numLines) {
            res.send({
                seqs: seqs
            });
        }
    };

    fs.createReadStream(alignedSeqs)
        .pipe(ndjson.parse())
        .on('data', trySend);
});


app.listen(3000);

console.log('Express server listening on port 3000');
