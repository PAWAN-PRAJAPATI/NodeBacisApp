
//var MongoClient = require('mongodb').MongoClient;


class appMongo{
    constructor(db,collection){
        this.db = db
        this.collection = collection
        //this.url = 'mongodb://vishwesh1010:vishwesh101025@ds163530.mlab.com:63530/driving'
        this.url = "mongodb://localhost:27017/local"
        //this.url = 'mongodb://pawan64:feelsgood64@ds263590.mlab.com:63590/user64'
        this.MongoClient = require('mongodb').MongoClient;
        console.log("Initialize")
    }
  
    insertOne(data,callback,req,res,next){
        console.log("In mongo")
        var db_name = this.db
        var db_collection  = this.collection

        const MongoClient = this.MongoClient
        const MONGO_URL = this.url

        MongoClient.connect(MONGO_URL, function(err, db) {
        if(err) throw err
        var dbo = db.db(db_name);
        dbo.collection(db_collection).insertOne(data,
            function (err) {
                console.log(data._id)
            if (err) {
                db.close();
                return console.log(err);
            }
            callback(data,req,res,next,err)
            db.close();
            }
        )
        })  
    }

    find(query,callback,req=null,res=null,next=null){
        var db_name = this.db
        var db_collection  = this.collection
        const MongoClient = this.MongoClient
        var url = this.url

        MongoClient.connect(url, function(err, db) {
            if(err) throw err
            var dbo = db.db(db_name);
            dbo.collection(db_collection).find(query).toArray(function(err, result) {
                db.close();
                callback(result,req,res,next,err)
            });
        });
    }

    findOne(query,callback,req,res,next){
        var db_name = this.db
        var db_collection  = this.collection
        const MongoClient = this.MongoClient
        var url = this.url

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            dbo.collection(db_collection).findOne(query,function(err, result) {
                callback(result,req,res,next,err)
                db.close();
            });
        });
    }

    updateOne(query,value,callback,req,res,next){
        var db_name = this.db
        var db_collection  = this.collection
        const MongoClient = this.MongoClient
        var url = this.url


        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            //var myquery = { event: "stop" };
            //var newvalues = { $set: {event: "faltu", address: "Canyon 123" } };
            dbo.collection(db_collection).updateOne(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
            callback("data",req,res,next,err)
            });
        });
    }

    updateMany(query,value,callback,req,res,next){
        var db_name = this.db
        var db_collection  = this.collection
        const MongoClient = this.MongoClient
        var url = this.url


        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            //var myquery = { event: "stop" };
            //var newvalues = { $set: {event: "faltu", address: "Canyon 123" } };
            //callback(dbo,db_collection,req,res,next,err)
            
            dbo.collection(db_collection).updateMany(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
            callback("data",req,res,next,err)
            });
        });
    }

    connect(callback,req,res,next){

        var db_name = this.db
        var db_collection  = this.collection
        const MongoClient = this.MongoClient
        var url = this.url

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            var collection = dbo.collection(db_collection)
            callback(collection,db,req,res,next,err)

        })

    }

    insertMany(documents,callback,req,res,next){
        this.connect((collection,db,req,res,next,err)=>{
            collection.insertMany(documents,function(result,err){
                callback(result,req,res,next,err)                
            })
        },req,res,next)
    }


}
module.exports = appMongo