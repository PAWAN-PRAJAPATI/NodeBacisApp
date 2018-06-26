const express = require('express')
const app = express.Router()
var ObjectID = require('mongodb').ObjectID

var appMongo = require("./appMongo")

var property_coll = new appMongo("user64","Property")
var property_unit_coll = new appMongo("user64","PropertyUnit")
var assets_coll = new appMongo("user64","Asset")
var properties = new appMongo("user64","Properties")
var employee = new appMongo("user64","Employee")



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

function makeNumber(n) {
    var text = "";
    var possible = "1234567890";
    for (var i = 0; i <= n; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text
}

function createProperty(n,req,res,next){
    var l = []
    for(var i=0; i<n+1; i++){
        var r = Math.floor(Math.random() * 8 + 3)
        l.push({Name:makeText(2),Address:makeText(r)})
    }
    property_coll.connect((collection,db,req,res,next,err)=>{
        collection.insertMany(l)
    },req,res,next)
    console.log(l)
}

function createUnits(n,req,res,next){
    property_coll.find({},(property_list,req,res)=>{
        var l = []
        for(var i = 0; i < n; i++){
            var rand = Math.floor(Math.random() * property_list.length)
            var unit = {
                Name:makeText(2),
                Property_id:new ObjectID(property_list[rand]._id)
            }
            l.push(unit)
        }
        console.log(l)
    property_unit_coll.insertMany(l,(result,req,res)=>{
        res.send("Inserted")
    },req,res,next)

    },req,res,next)
}




function lookupcallback(collection,db,req,res,next,err){
    collection.aggregate([
        { $lookup:
           {
             from: 'PropertyUnit',
             localField: '_id',
             foreignField: 'Property_id',
             as: 'Units'
           }
         },
         {$project:{ "_id":1,"Name":1,"Address":1,"Units._id":1 }}
        ]).toArray(function(err, result) {
        if (err) throw err;
        //properties.insertMany(result,()=>{},req,res,next)
        console.log(result);
        res.send(result)
        
      });
      //next()
}

function createTenant(n){
    var l = []
    for(var i = 0; i < n; i++){
        var tanent = {
            Name:makeText(2),
            Contact:makeNumber(10),
            Email:makeText(1)+ "@gmail.com"
        }
        l.push(tanent)
    }
    return l
}

function addTanentsToUnits(n,req,res,next){
    assets_coll.find({},(assets_list)=>{
        property_unit_coll.find({},(units_list,req,res)=>{
            
            for(var i = 0; i < n; i++){
                var rand_assets = createAssets(assets_list)
                var rand_unit = units_list[Math.floor(Math.random() * units_list.length)]
                var tanents = createTenant(2)
                console.log(tanents)
                console.log(rand_unit)

                property_unit_coll.updateOne({_id:rand_unit._id},{$set: {Tanents:tanents,Assets:rand_assets}},()=>{console.log("Updated")},req,res,next)
                //property_unit_coll.updateOne({_id:rand_unit._id},{$set: {Assets:rand_assets}},()=>{console.log("Updated")},req,res,next)
            }
        },req,res,next)
    },req,res,next)

}

function createEmployee(n,req,res,next){
    var l = []
    employee.find({},(emp_list,req,res)=>{

    assets_coll.find({},(assets_list)=>{

        for( var i = 0; i<n ;i++){
            var rand_emp = emp_list[Math.floor(Math.random() * emp_list.length)]

            var rand_asset = assets_list[Math.floor(Math.random() * assets_list.length)]
            var emp = {
                Name:makeText(2),
            }
            l.push(emp)
            employee.updateOne({_id:rand_emp._id},{$push:{asset_type:rand_asset.type} },()=>{console.log("Updated")},req,res,next)

        }
        console.log(l)
        //employee.insertMany(l,()=>{console.log("Inserted")},req,res,next)
    },req,res,next)
},req,res,next)

}

function addAssetsToUnits(n,req,res,next){

    assets_coll.find({},(assets_list)=>{

        property_unit_coll.find({},(units_list)=>{
            for(var i = 0;i < n ;i++){
                //var rand_number = Math.floor(Math.random() * 15)
                var rand_assets = createAssets(assets_list)
                var rand_unit = units_list[Math.floor(Math.random() * units_list.length)]
                console.log(rand_assets)
                property_unit_coll.updateOne({_id:rand_unit._id},{$set: {Assets:rand_assets}},()=>{console.log("Updated")},req,res,next)
            }
            console.log("Updated")
        },req,res,next)
        
    },req,res,next)
    
}

function createAssets(assets_list){
    var l = []
    var n = Math.floor(Math.random() * 15)
        for(var i = 0;i < n ;i++){
            var rand_asset = assets_list[Math.floor(Math.random() * assets_list.length)]
            var rand_number = Math.floor(Math.random() * assets_list.length)

            var asset = {
                Asset_id:rand_asset._id,
                Number:rand_number
            }
            l.push(asset)
        }
    return l
}

app.get('/create_property',(req,res,next)=>{
    console.log(createProperty(10,req,res,next))
})

app.get('/create_units',(req,res,next)=>{
    createUnits(100,req,res,next)
})

app.get('/create_tanents',(req,res,next)=>{
    addTanentsToUnits(20,req,res,next)
})

app.get('/lookup',(req,res,next)=>{
    console.log("IN LOOKUP")
    property_coll.connect(lookupcallback,req,res,next)
})

app.get("/add_assets",(req,res,next)=>{
    addAssetsToUnits(10,req,res,next)
})

app.get("/create_emp",(req,res,next)=>{
    createEmployee(20,req,res,next)
})

app.get("/find",(req,res,next)=>{
   property_unit_coll.find({},(result,req,res)=>{
       console.log(result)
       res.send(result)
    },req,res,next)
})


function getTenantsList(Property_id,req,res,next){
    property_unit_coll.connect((collection,db)=>{
        collection.aggregate(
            [{$match:{Property_id:Property_id}},
            {$project:{"Tanents":1,"Property_id":1}},
            {$unwind:"$Tanents"},
            {$group:{
                _id:"$Property_id",
                Tanents:{$push:"$Tanents"}
            }}
        ]
        ).toArray(function(err, result) {
            console.log(result)
            res.send(result)
        })
        
    },req,res,next)
}

function getEmployee(asset_type){
    employee.connect((collection,db)=>{
        collection.find({asset_type:asset_type}).toArray(function(err,result){
            console.log(result)
            res.send(result)
        })
    })
}

app.get("/get_tenants",(req,res,next)=>{
    var _id  = new ObjectID("5b31c4506ea94d047b79d51f")
    getTenantsList(_id,req,res,next)
})


app.get("/get_emp",(req,res,next)=>{
    getEmployee("Type_A")
})


module.exports = app

