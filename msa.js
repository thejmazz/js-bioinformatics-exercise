var msa = require("msa");
var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');
var concat = require('concat-stream');
var tool = require('tool-stream');
var $  = require('jquery');

var msaDiv = document.createElement('div');
msaDiv.innerHTML = 'Loading...';
document.body.appendChild(msaDiv);

var concatStream = concat(function(sequences) {
    sequences = sequences.map(function(seq) {
        var props = seq.id.split('|');
        seq.id = props[1];
        seq.name = props[4];
        return seq;
    });

    createMSAViz(sequences);
});

function createMSAViz(seqs) {
    var m = new msa({
        el: msaDiv,
        seqs: seqs
    });

    var menu = new msa.menu.defaultmenu({
        msa: m
    });
    m.addView('menu', menu);
    m.render();
}

var species = [];
function runPipe() {
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
        .pipe(concatStream);
}

function runFetch() {
    $.get('http://localhost:3000/aligned?q=mbp1&match=title&regex=^mbp1p?.*\[.*\]$').then(function(data) {
        createMSAViz(data.seqs);
    });
}

runFetch();
