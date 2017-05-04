module.exports = {
    parse(header, line) {
        var fieldNames = header.split(',');
        var fieldValues = line.split(',');
        var obj = new Object();
        for(var i = 0; i<fieldNames.length; i++){
            obj[fieldNames[i]] = fieldValues[i];
        }
        return obj;
    }
};