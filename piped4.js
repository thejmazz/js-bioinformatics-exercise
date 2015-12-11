var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');
var concat = require('concat-stream');
var tool = require('tool-stream');
var cp = require('child_process');
var ndjson = require('ndjson');

var species = [];

var rMSA = cp.spawn('/Users/jmazz/r/js-bioinformatics-exercise/msa2.r');

ncbi.search('protein', 'mbp1')
    .pipe(filter.obj(function (obj) {
        return obj.title.match(/^mbp1p?.*\[.*\]$/i);
    }))
    .pipe(filter.obj(function (obj) {
        var specieName = obj.title.substring(obj.title.indexOf('[') + 1, obj.title.length-1);
        specieName = specieName.split(' ').slice(0,1).join(' ');
        if (species.indexOf(specieName) >= 0) {
            return false;
        } else {
            species.push(specieName);
            return true;
        }
    }))
    .pipe(tool.extractProperty('gi'))
    .pipe(ncbi.fetch('protein'))
    .pipe(es.through(function (obj) {
        this.emit('data', JSON.stringify(obj) + '\n');
    }))
    .pipe(rMSA.stdin);

var seqs=[];
rMSA.stdout
    .pipe(ndjson.parse())
    .on('data', function(data) {
        seqs.push(data);
    })
    .on('end', function() {
        console.log({
            seqs: seqs
        });
    });
