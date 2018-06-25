const express = require('express')
const app = express.Router()
var appMongo = require("./appMongo")

var property_coll = new appMongo("user64","Property")
var property_unit_coll = new appMongo("user64","PropertyUnit")
var assets_coll = new appMongo("user64","Asset")


app.get('/getall',(req,res,next)=>{
    property_coll.connect((collection,db,req,res,next,err)=>{
        collection.aggregate([
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
    },req,res,next)
    
})

app.post('/insert_tanent',(req,res,next)=>{
    var value = req.body

    property_unit_coll.connect((collection,db,req,res,next,err)=>{
    console.log(value,"value")
    collection.update(
        {Name:"C-231"},
        { $push:
           {
             tenant:{
                 $each:[value]
             }
           }
         }
        )
    })
})

function asset(){
    const asset_type = [{
        name:["Name_AA","Name_AB","Name_AC",'Name_AD','Name_AE','Name_AF'],
        type:"Type_A"
    }, {
        name:["Name_BA","Name_BB","Name_BC",'Name_BD','Name_BE','Name_BF','Name_BG','Name_BH'],
        type:"Type_B"
    },
    {
        name:["Name_CA","Name_CB","Name_CC",'Name_CD','Name_CE','Name_CF'],
        type:"Type_C"
    },
    {
        name:["Name_DA","Name_DB","Name_DC",'Name_DD','Name_DE','Name_DF'],
        type:"Type_D"
    }
]
   
    l = []
    for(var i = 0;i<20;i++ ){
        var name_l = Math.floor(Math.random() * asset_type[0].name.length);
        var type_l = Math.floor(Math.random() * asset_type.length);
        l.push({name:asset_type[type_l].name[name_l],type:asset_type[type_l].type})
    }

    assets_coll.connect((collection,db,req,res,next,err)=>{
        collection.insertMany(l)
    })

    console.log(l)
    res.send("success")
}

function makeText(n) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var j=0;j<n;j<j++){
        for (var i = 0; i < Math.floor(Math.random() * 8 + 3); i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        text+=" "
    }
    return text
}

function createProperty(n){
    var l = []
    for(var i=0; i<n+1; i++){
        var r = Math.floor(Math.random() * 8 + 3)
        l.push({Name:makeText(2),Address:makeText(r)})
    }
    property_coll.connect((collection,db,req,res,next,err)=>{
        collection.insertMany(l)
    })
    console.log(l)
}




app.get('/random',(req,res,next)=>{
    console.log(createProperty(10))
})

module.exports = app

