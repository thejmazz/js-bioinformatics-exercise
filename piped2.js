var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');

ncbi.search('protein', 'mbp1')
    .pipe(filter.obj(function (obj) {
        return obj.title.match(/^Mbp1p \[Saccharomyces cerevisiae [^Y]/);
    }))
    .pipe(es.through(function (obj) {
        this.emit('data', obj.gi + '\n');
    }))
    .pipe(ncbi.fetch('protein'))
    .pipe(es.stringify())
    .pipe(es.through(function (str) {
        this.emit('data', str);
    }))
    .pipe(process.stdout);
