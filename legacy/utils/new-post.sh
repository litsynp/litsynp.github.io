#!bin/bash
# Script used to generate new hugo post

# Get the title of the post from parameter
title=$1

# Replace spaces with dashes and make lowercase
title_slug=$(echo $title | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Generate the datetime and make nested directories
year=$(date +%Y)
month=$(date +%m)
day=$(date +%d)
timestamp=$(date +%Y-%m-%dT%H:%M:%S%z)

# Generate the file path
hugo_file_path="posts/$year/$month/$day/$title_slug.md"
file_full_path="content/$hugo_file_path"

# Check if the file already exists
if [ -f $file_full_path ]; then
  echo "Error: File $file_full_path already exists"
  return 1
fi

# Generate the post
hugo new $hugo_file_path

# Replace the content with the template
cat utils/post-template.md >$file_full_path

# Replace the title ${title} and timestamp ${timestamp}
sed -i '' -e "s/\${title}/$title/g" $file_full_path
sed -i '' -e "s/\${timestamp}/$timestamp/g" $file_full_path
