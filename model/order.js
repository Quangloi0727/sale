const mongoose=require('mongoose');
var order= new mongoose.Schema({tensp:'string',anhsp:'string',giasp:Number,soluong:'string',sessionid:'string'},{collection:'order'})
module.exports=mongoose.model('order',order);