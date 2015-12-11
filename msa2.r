#!/usr/bin/env rscript

# Packages
if (!require(Biostrings, quietly=TRUE)) {
    source("https://bioconductor.org/biocLite.R")
    biocLite("Biostrings")
}
data(BLOSUM62)

if (!require(msa, quietly=TRUE)) {
    source("https://bioconductor.org/biocLite.R")
    biocLite("msa")
    library(msa)
}

if (!require(jsonlite, quietly=TRUE)) {
    install.packages("jsonlite")
}

# Open stdin connection
stdin <- file("stdin")
open(stdin)

# jsonlite parse stdin ndjson into data frame
seqs <- stream_in(stdin, verbose=FALSE)

# Create AAStringSet vector out of sequences
seqSet <- AAStringSet(c(seqs$seq))
# Make sure to set names so we can identify later!
seqSet@ranges@NAMES <- seqs$id

# Compute alignment with MUSCLE
msa <- msaMuscle(seqSet, order="aligned")

# Alter values in seqs data frame
for (i in 1:nrow(msa)) {
    seqs$id[i] = msa@unmasked@ranges@NAMES[i]
    seqs$seq[i] = as.character(msa@unmasked[i][[1]])
}

# Back to stdout
stream_out(seqs, verbose=FALSE)
