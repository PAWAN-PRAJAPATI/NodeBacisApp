const express = require('express')
const bodyParser = require('body-parser')
const app = express.Router()

var appMongo = require("./appMongo")
app.use(bodyParser.urlencoded())

var notesMongo = new appMongo("user64","notes")



function callbackInsert(data,req,res,next,err){
    if(err) res.send("Custom Error:\n"+err)
    else res.send("inserted at:"+data._id)
}

function callbackUpdate(dbo,db_collection,req,res,next,err){
    if(err) res.send("Custom Error:\n"+err)
    else {
        dbo.collection(db_collection).updateMany(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
            callback("data",req,res,next,err)
        });
    }
}

function callbackConnect(collection,db,req,res,next,err){

    collection.createIndex( { location: "2dsphere" } )
    
    //console.log(req.body)
    total = req.body
    if(err){
        res.send(JSON.stringify({status:"error1"}))
        db.close()
    }
    //db.tollbooth.createIndex( { location: "2d" } )
    //console.log(req.body)
    total = req.body
    if(err){
        res.send(JSON.stringify({status:"error1"}))
        db.close()
    }
    collection.insertMany(req.body.data,function(err,result){
        if(err){
            console.log(err)
            res.send(JSON.stringify({status:"error2"}))
            db.close()
        }
        else{
            console.log("Updated")
            res.send(JSON.stringify({status:"success"}))
            db.close()
        }
    })
    //next()
}


function callbackfind(data,req,res,next,err){
    if(err) res.send("Custom Error:\n"+err)
    else res.send(data)
}


app.post('/connect',(req,res,next)=>{
    notesMongo.connect(callbackConnect,req,res,next)
})

app.get('/insert',(req,res,next)=>{
    console.log("Inserting")
    var key = req.query.event
    notesMongo.insertOne({"event":key},callbackInsert,req,res,next)

},(req,res)=>{
    console.log("Inserted")
    res.send("Inserted")
    }
)

app.get('/find',(req,res,next)=>{
    console.log("Finding")
    var key = req.query.event
    notesMongo.find({"event":key},callbackfind,req,res,next)

},(req,res,next)=>{
    console.log("Found")
    res.send("Database updated")
    }
)

app.get('/update',(req,res,next)=>{
    console.log("Hello")
    var key = req.query.event
    var query = { event: key }
    var value = { $set: {event: "faltu", address: "Canyon 123" } }
    //notesMongo.insertOne({asdfd:"asdfsdf"},display,next)
    notesMongo.updateOne(callbackUpdate,req,res,next)

},(req,res,next)=>{
    console.log("update final ware")
    res.send("Database updated")
    }
)

var Property = new appMongo("user64","Property")


app.get('/lookup',(req,res,next)=>{
    console.log("IN LOOKUP")
    Property.connect(lookupcallback,req,res,next)
})


function lookupcallback(collection,db,req,res,next,err){
    collection.aggregate([
        {$match:{Address:"Monalisa BC"}},
        { $lookup:
           {
             from: 'PropertyUnit',
             localField: '_id',
             foreignField: 'PropertyUnit',
             as: 'Units'
           }
         }
        ]).toArray(function(err, result) {
        if (err) throw err;
        //console.log((res));
        res.send(result)
        db.close();
      });
      //next()
}

module.exports = app