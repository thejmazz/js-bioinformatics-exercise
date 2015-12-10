var msa = require('msa');

var seqs = msa.utils.seqgen.genConservedSequences(10,30, "ACGT-");

console.log(seqs);
