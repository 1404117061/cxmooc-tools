/**
 * 慕课数据库模型
 */
const serverConfig = require('./config');

var mongodb = require('mongodb');
module.exports = function () {
    // var url = "mongodb://localhost:27017/cxmooc";
    var url = serverConfig.mongoDB;
    var db;
    var dbase;
    mongodb.connect(url, (err, _db) => {
        if (err) throw err;
        db = _db;
        dbase = db.db("cxmooc");
        dbase.createCollection('answer', function (err, res) {
            if (err) throw err;
        });
    });
    this.insert = function (set, row) {
        return dbase.collection(set).insertOne(row);
    }

    this.find = function (set, cond, option) {
        return dbase.collection(set).find(cond, option);
    }
    this.findOne = function (set, cond, callback) {
        return dbase.collection(set).findOne(cond, null, callback);
    }

    this.count = function (set, cond, callback) {
        return dbase.collection(set).count(cond, null, callback);
    }

    this.updateOne = function (set, cond, data, callback) {
        return dbase.collection(set).updateOne(cond, data, callback);
    }

    this.traversal = function (set) {
        return dbase.collection(set).find()
    }

    return this;
}