var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');

ncbi.search('protein', 'mbp1')
    .pipe(filter.obj(function (obj) {
        return obj.title.match(/^mbp1p?.*\[.*\]$/i);
    }))
    .pipe(es.through(function (data) {
        this.emit('data', data.title + '\n');
    }))
    .pipe(process.stdout);
