var mongoose  = require('mongoose');
 var bookSchema = mongoose.Schema({
   title:{
     type:String,
     required:true
   },
   text:{
    type:String,
    required:true
  }
 });
 var Book = module.exports = mongoose.model('Book',bookSchema)

 module.exports.getBooks = function(callback){
    console.log(callback)
    Book.find(callback)
 }