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

# File descriptor for reading sequence data
fdR <- file("outputs/seqs.ndjson", "r")
seqs <- stream_in(fdR)

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

# File descriptor for writing
fdW <- file("outputs/seqsAligned.ndjson", "wb")
# Convert seqs to ndjson and write to file
stream_out(seqs, fdW)
