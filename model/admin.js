const mongoose=require('mongoose');
var admin= new mongoose.Schema({email:'string',fullname:'string',avtimg:'string',password:'string'},{collection:'admin'})
module.exports=mongoose.model('admin',admin);