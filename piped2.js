var ncbi = require('bionode-ncbi');
// Stream utilities
var es = require('event-stream');
var filter = require('through2-filter');
var concat = require('concat-stream');
var tool = require('tool-stream');

var concatStream = concat(function(array) {
    console.log(array);
});

ncbi.search('protein', 'mbp1')
    .pipe(filter.obj(function (obj) {
        return obj.title.match(/^Mbp1p \[Saccharomyces cerevisiae [^Y]/);
    }))
    .pipe(tool.extractProperty('gi'))
    .pipe(ncbi.fetch('protein'))
    .pipe(concatStream);
