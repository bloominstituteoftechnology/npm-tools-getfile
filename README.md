# @bloomtools/getfile

This tool takes a file as its argument and returns its absolute path.

If the file does not exist, it returns the absolute path of the most recently modified file of the same extension.

## ✨ Requirements

1. Node >= 16.x
2. Git Bash (Windows users)

## ✨ Usage

```bash
npx @bloomtools/getfile index.html
### Looks for an index.html file in the working directory
### If not found looks for the .html file modified most recently

npx @bloomtools/getfile ~/cat.jpg
### Looks for a cat.jpg file in the path provided
### If not found looks for the .jpg file modified most recently
```
