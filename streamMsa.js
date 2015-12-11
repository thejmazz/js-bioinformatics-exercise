var ncbi = require('bionode-ncbi');
var es = require('event-stream');
var filter = require('through2-filter');
var concat = require('concat-stream');
var tool = require('tool-stream');
var cp = require('child_process');
var ndjson = require('ndjson');

// Only supports one level deep property
// i.e. car['wheels'] and not car['wheels.tire']
// for that, do car.wheels['tire']
function propMatchRegex(obj, prop, regex) {
    return obj[prop].match(regex);
}

function getProteinSeqs(req, res, next) {
    var opts = req.opts;

    // var species = [];
    var rMSA = cp.spawn('/Users/jmazz/r/js-bioinformatics-exercise/msa.r');

    var stream = ncbi.search('protein', opts.query);

    opts.filters.forEach(function (f) {
        stream = stream.pipe(filter.obj(f));
    });

    if (opts.uniqueSpecies) {
        // This will actually belong to scope of function
        var species=[];

        stream = stream
            .pipe(filter.obj(function (obj) {
                var specieName = obj.title.substring(obj.title.indexOf('[') + 1, obj.title.length-1);
                specieName = specieName.split(' ').slice(0,1).join(' ');
                if (species.indexOf(specieName) >= 0) {
                    return false;
                } else {
                    species.push(specieName);
                    return true;
                }
            }));
    }

    stream
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
            res.send({
                seqs: seqs
            });
        });
}

module.exports = {
    getProteinSeqs: getProteinSeqs,
    propMatchRegex: propMatchRegex
};
