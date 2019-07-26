const mongoose=require('mongoose');
var product= new mongoose.Schema({tensp:'string',soluong:Number,gia:Number,anhsp:'string',mota:'string',nhomsp:'string'},{collection:'san_pham'});
module.exports=mongoose.model('product',product);