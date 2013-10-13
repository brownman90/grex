var Utils = require("./utils"),
    isObject = Utils.isObject,
    isArray = Utils.isArray;

var typeHash = {
    'integer': 'i',
    'long': 'l',
    'float': 'f',
    'double': 'd',
    'string': 's',
    'boolean': 'b',
    'i': 'i',
    'l': 'l',
    'f': 'f',
    'd': 'd',
    's': 's',
    'b': 'b',
    'list': 'list',
    'map': 'map'
};


module.exports = function addTypes(obj, typeDef, embedded, list){
    console.log("==addTypes==");
    console.log(obj, typeDef);

    var tempObj = {};
    var tempStr = '';
    var obj2, idx = 0;

    for(var k in obj){
        if(obj.hasOwnProperty(k)){
            if(typeDef){
                if ((k in typeDef) && isObject(typeDef[k])) {
                    if(embedded){
                        if (list) {
                            obj2 = obj[k];

                            for(var k2 in obj2){
                                if(obj2.hasOwnProperty(k2)){
                                    if(typeDef[k] && (k2 in typeDef[k])){
                                        tempStr += '(map,(' + addTypes(obj[k], typeDef[k], true) + '))';
                                    }
                                }
                            }
                        } else {
                            tempStr += k + '=(map,(' + addTypes(obj[k], typeDef[k], true) + '))';
                        }
                        tempStr = tempStr.replace(')(', '),(');
                    } else {
                        tempObj[k] = '(map,(' + addTypes(obj[k], typeDef[k], true) + '))';
                    }
                } else if ((k in typeDef) && isArray(typeDef[k])) {
                    if(embedded){
                        tempStr += '(list,(' + addTypes(obj[k], typeDef[k], true, true) + '))';
                        tempStr = tempStr.replace(')(', '),(');
                    } else {
                        tempObj[k] = '(list,(' + addTypes(obj[k], typeDef[k], true, true) + '))';
                    }
                } else {
                    if(embedded){
                        if (list) {
                            if (k in typeDef) {
                                idx = k;
                                tempStr += '(' + typeHash[typeDef[idx]] + ',' + obj[k] + ')';
                            } else {
                                idx = typeDef.length - 1;
                                if (isObject(typeDef[idx])) {
                                    tempStr += ',(map,(' + addTypes(obj[k], typeDef[idx], true) + '))';
                                } else if (isArray(typeDef[idx])){
                                    tempStr += ',(list,(' + addTypes(obj[k], typeDef[idx], true, true) + '))';
                                } else {
                                  tempStr += '(' + typeHash[typeDef[idx]] + ',' + obj[k] + ')';
                                }
                            }
                            tempStr = tempStr.replace(')(', '),(');
                        } else {
                            if (k in typeDef) {
                                tempStr += k + '=(' + typeHash[typeDef[k]] + ',' + obj[k] + ')';
                                tempStr = tempStr.replace(')(', '),(');
                            } else {
                                tempObj[k] = obj[k];
                            }
                        }
                    } else {
                        if (k in typeDef) {
                            tempObj[k] = '(' + typeHash[typeDef[k]] + ',' + obj[k] + ')';
                        } else {
                            tempObj[k] = obj[k];
                        }
                    }
                }
            } else {
                tempObj[k] = obj[k];
            }
        }
    }

    console.log("--end of addTypes--");

    return embedded ? tempStr : tempObj;
};
