const mongoose=require('mongoose');
var hoa_don= new mongoose.Schema({fullname:'string',phone:'string',address:'string',tensp:'string',soluong:'string',giasp:Number,tongtien:Number},{collection:'hoa_don'})
module.exports=mongoose.model('hoa_don',hoa_don);