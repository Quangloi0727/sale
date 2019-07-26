var shortid=require('shortid');
module.exports=function(req,res,next){
    if(!req.signedCookies.sessionid){
        res.cookie('sessionid',shortid.generate(),{
            signed:true
        });
    }
    next();
}