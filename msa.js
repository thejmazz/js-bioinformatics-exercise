var msa = require("msa");
var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');
var concat = require('concat-stream');
var tool = require('tool-stream');

var msaDiv = document.createElement('div');
document.body.appendChild(msaDiv);

var concatStream = concat(function(sequences) {
    sequences = sequences.map(function(seq) {
        var props = seq.id.split('|');
        seq.id = props[1];
        seq.name = props[4];
        return seq;
    });

    console.log(sequences);
    var m = new msa({
        el: msaDiv,
        seqs: sequences
    });
    m.render();
});

ncbi.search('protein', 'mbp1')
    .pipe(filter.obj(function (obj) {
        return obj.title.match(/^Mbp1p \[Saccharomyces cerevisiae [^Y]/);
    }))
    .pipe(tool.extractProperty('gi'))
    .pipe(ncbi.fetch('protein'))
    .pipe(concatStream);
