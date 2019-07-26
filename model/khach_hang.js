const mongoose = require('mongoose');
var khach_hang= new mongoose.Schema({email:'string',password:'string',fullname:'string',gender:'string',phone:Number,address:'string'},{collection:'khach_hang'});
module.exports = mongoose.model('khach_hang',khach_hang);