
const express = require('express')
const app = express.Router()

const Event = require('./eventModel')
var appMongo = require("./appMongo")

app.get('/test',(req,res,next)=>{
    console.log("in models")
    new Event({
        event:"acc",
        lat:"12.23",
        long:"12.3345"
    }).save().then((newEvent)=>{
        console.log(newEvent);
 });
})

module.exports = app