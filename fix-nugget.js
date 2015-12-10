var fs = require('fs');

var pkg = 'node_modules/bionode-ncbi/node_modules/nugget/package.json';

var pkgObj = JSON.parse(fs.readFileSync(pkg));

pkgObj.browser = {
    'single-line-log': false
};

fs.writeFileSync(pkg, JSON.stringify(pkgObj));

console.log('Fixed nugget');
