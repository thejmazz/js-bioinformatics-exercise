var fs = require('fs');

// return array of uids of proteins with title containing `mbp1`
function filter(proteins, cb) {
    var num = 0;
    var filtered = [];

    var check = function(err, data) {
        if (err) cb(err);

        num+= 1;
        var obj = JSON.parse(data);
        if (obj.title !== undefined && obj.title.toUpperCase().indexOf('MBP1') >= 0) {
            filtered.push(obj.uid);
        }
        tryFinish();
    };

    var tryFinish = function() {
        if (num === proteins.length) {
            cb(null, filtered);
        }
    };

    proteins.forEach(function(protein) {
        fs.readFile('data/' + protein, check);
    });
}

filter(fs.readdirSync('data'), function(err, mbp1s) {
    if (err) console.error(err);

    mbp1s.forEach(function(uid) {
        fs.readFile('data/' + uid + '.json', function(err, data) {
            if (err) console.error(err);

            var obj = JSON.parse(data);
            console.log(obj.title);
        });
    });
});
