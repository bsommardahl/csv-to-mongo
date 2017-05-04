# csv-uploader-test

## Installation
You will need the following environment variables:
- `MONGODB_URI`
- `COLLECTION_NAME`

Run `npm install` to load all the dependencies before running `npm start`.

## Execution
Run the server and try the following command from the command-line:
```
curl -F "file=@./sample.csv" localhost:10123/submit
```
