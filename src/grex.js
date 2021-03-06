var q = require("q"),
    _ = require("lodash"),
    merge = require("./utils").merge,
    Transaction = require("./transaction/transaction"),
    queryMain = require("./gremlin");

var ResultFormatter = require("./resultformatter");


module.exports = (function(){
    function Grex(options) {
        this.options = _.defaults(options || {
            'host': 'localhost',
            'port': 8182,
            'graph': 'tinkergraph',
            'idRegex': false // OrientDB id regex -> /^[0-9]+:[0-9]+$/
        });

        this.typeMap = {};
        this.resultFormatter = new ResultFormatter();
    }

    Grex.prototype.connect = function(){
        return q.fcall(function() {
            return this;
        }.bind(this));
    };

    Grex.prototype.V = queryMain('V', true);
    Grex.prototype._ = queryMain('_', true);
    Grex.prototype.E = queryMain('E', true);
    Grex.prototype.V =  queryMain('V', true);

    //Methods
    Grex.prototype.e = queryMain('e', true);
    Grex.prototype.idx = queryMain('idx', true);
    Grex.prototype.v = queryMain('v', true);

    //Indexing
    Grex.prototype.createIndex = queryMain('createIndex', true);
    Grex.prototype.createKeyIndex = queryMain('createKeyIndex', true);
    Grex.prototype.getIndices = queryMain('getIndices', true);
    Grex.prototype.getIndexedKeys = queryMain('getIndexedKeys', true);
    Grex.prototype.getIndex = queryMain('getIndex', true);
    Grex.prototype.dropIndex = queryMain('dropIndex', true);
    Grex.prototype.dropKeyIndex = queryMain('dropKeyIndex', true);

    //Types
    Grex.prototype.makeKey = queryMain('makeKey', true);

    Grex.prototype.clear =  queryMain('clear', true);
    Grex.prototype.shutdown = queryMain('shutdown', true);
    Grex.prototype.getFeatures = queryMain('getFeatures', true);

    // Titan specifics
    Grex.prototype.getTypes = queryMain('getTypes', true);

    Grex.prototype.begin = function (typeMap) {
        typeMap = typeMap ? merge(typeMap, this.typeMap) : this.typeMap;

        return new Transaction(this.options, typeMap);
    };

    return Grex;
})();
