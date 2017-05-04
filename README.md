# csv-to-mongo

This simple server provides a single endpoint to which you can upload a CSV file. In turn, the contents of that CSV file will be added to a collection in a mongo database. This particular implementation was made for a specific use, but with minor modifications, it can work for almost any type of CSV and any type of document shape. It can quickly burn through hundreds of thousands of CSV records in seconds.

### Process:
1. Upload file
2. Read stream by line-sized chunks.
3. Parse the lines into objects.
4. Convert the objects into client specified documents.
5. Insert documents in batches of x documents (x is currently 500).

## Installation
You will need the following environment variables:
- `MONGODB_URI`
- `COLLECTION_NAME`
- `PROMISE_THROTTLE`
- `INSERT_BATCH_SIZE`

Run `npm install` to load all the dependencies before running `npm start`.

## Execution
Run the server and try the following command from the command-line:
```
curl -F "file=@./sample.csv" localhost:10123/submit
```
