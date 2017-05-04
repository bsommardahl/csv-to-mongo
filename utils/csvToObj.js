module.exports = {
    parse(header, line) {
        const fieldNames = header.split(',');
        const fieldValues = line.split(',');
        const obj = new Object();
        for(let i = 0; i<fieldNames.length; i++){
            obj[fieldNames[i]] = fieldValues[i];
        }
        return obj;
    }
};