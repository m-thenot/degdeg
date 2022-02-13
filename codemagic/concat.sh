#!/bin/bash
#
# Concat workflows to single file
#

# Create a new file from the default one
cp default codemagic.yaml

# Add workflows to the file
sed 's/^/  /' cat workflow-* >> codemagic.yaml

# Move the file where it belongs
mv codemagic.yaml ..

git add ../codemagic.yaml

exit
