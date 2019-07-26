var express = require('express');
var router = express.Router();
var khach_hang=require('../model/khach_hang.js');
var hoa_don=require('../model/hoa_don.js');
var admin=require('../model/admin.js');
var product=require('../model/product.js');
var order=require('../model/order.js');
var tenimg=[];
var anhsp=[];
var multer  = require('multer');
/* up ảnh admin*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/image_admin');
    cb(null, './public/anhsp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
    tenimg.push(file.originalname);
    anhsp.push(file.originalname);
  }
})
var upload = multer({ storage: storage });
var md5 = require('md5');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Làng nghề mộc Kênh',fullname:req.session.fullname,sl:req.session.sl});
});
/* Trang đăng nhập. */
router.get('/login', function(req, res, next) {
  var err=[];
  res.render('login', { title: 'Đăng nhập',err:err,fullname:req.session.fullname,sl:req.session.sl });
});
/* Trang đăng kí. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Đăng kí',fullname:req.session.fullname,sl:req.session.sl });
});
/* Trang đăng nhập vào admin. */
router.get('/login_admin', function(req, res, next) {
  var loi=[];
  res.render('login_admin', { title: 'Đăng nhập Admin',loi:loi });
});
/* Trang quản trị. */
router.get('/admin',checkLogin,function(req, res, next) {
  res.render('admin', { title: 'Trang quản trị',email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg });
});
/* Xóa tài khoản admin. */
router.get('/remove/:idcanxoa',checkLogin, function(req, res, next) {
  var idcanxoa=req.params.idcanxoa;
  admin.findByIdAndRemove(idcanxoa).exec();
  res.redirect('/viewAccount_admin');
});
/*Trang xóa sản phẩm */
router.get('/removeProduct/:idcanxoa',checkLogin,function(req,res,next){
  var idcanxoa=req.params.idcanxoa;
  product.findByIdAndRemove(idcanxoa).exec();
  res.redirect('/viewProduct');
});
/*Trang sửa sản phẩm */
router.get('/editProduct/:idcansua',checkLogin,function(req,res,next){
  var idcansua=req.params.idcansua;
  product.find({_id:idcansua} , function(err, dulieu){
    res.render('editProduct', { title: 'Sửa thông tin sản phẩm' , dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg });
    }); 
});
/*Trang (post )sửa sản phẩm */
router.post('/editProduct/:idcansua',checkLogin,function(req,res,next){
  var idcansua=req.params.idcansua;
  product.findById(idcansua, function (err, dulieu) {
    if (err) return handleError(err);
    dulieu.tensp = req.body.tensp;
    dulieu.gia = req.body.gia;
    dulieu.mota = req.body.mota;
    dulieu.nhomsp=req.body.nhomsp;
    dulieu.soluong=req.body.soluong
    dulieu.save();
    res.redirect('/viewProduct'); 
  });
});
/* Trang đăng xuất admin. */
router.get('/logout_admin', function(req, res,next) {
  res.clearCookie('email');
  res.clearCookie('fullname');
  res.clearCookie('avtimg');
  res.redirect('/login_admin');
});
/* Trang đăng xuất khách hàng. */
router.get('/logout', function(req, res,next) {
  req.session.destroy();
  res.redirect('/');
});
/* Trang thêm tài khoản admin. */
router.get('/add_admin',checkLogin, function(req, res, next) {
  res.render('add_admin', { title: 'Thêm quản trị viên',email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg});
});

/* Xem tài khoản admin. */
router.get('/viewAccount_admin',checkLogin, function(req, res, next) {
  admin.find({},function(err,dulieu){
  res.render('viewAccount_admin', { title: 'Xem thông tin tài khoản admin',dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg});
  });
});

/* Xem tài khoản khách hàng. */
router.get('/viewAccount_customer',checkLogin, function(req, res, next) {
  khach_hang.find({},function(err,dulieu){
  res.render('viewAccount_customer', { title: 'Xem thông tin tài khoản khách hàng',dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg});
  });
});
/* Thêm sản phẩm. */
router.get('/add_product',checkLogin, function(req, res, next) {
  res.render('add_product', { title: 'Thêm sản phẩm',email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg});
});
/* Trang quản lý sản phẩm */
router.get('/viewProduct',checkLogin,function(req,res,next){
  product.find({},function(err,dulieu){
    res.render('viewProduct', { title: 'Quản lý sản phẩm',dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg});
  })
});
/* Show sản phẩm cho khách hàng */
router.get('/showProduct',function(req,res,next){
  var page=parseInt(req.query.page) ||1
  var perPage=4;
  var start=(page-1)*perPage;
  var end=page*perPage;
  product.find({},function(err,dulieu){
    res.render('viewProduct_index',{title:'Danh sách sản phẩm',dulieu:dulieu.slice(start,end),fullname:req.session.fullname,sl:req.session.sl })
  })
});
/* Show sản phẩm cho khách hàng(nhóm nội thất phòng khách) */
router.get('/showProduct_livingRoom',function(req,res,next){
  product.find({nhomsp:'Nội thất phòng khách'},function(err,dulieu){
    res.render('viewProduct_livingRoom',{title:'Danh sách sản phẩm phòng khách',dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl })
  })
});
/* Show sản phẩm cho khách hàng(nhóm nội thất phòng ngủ) */
router.get('/showProduct_bedRoom',function(req,res,next){
  product.find({nhomsp:'Nội thất phòng ngủ'},function(err,dulieu){
    res.render('viewProduct_bedRoom',{title:'Danh sách sản phẩm phòng ngủ',dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl })
  })
});
/* Show sản phẩm cho khách hàng(nhóm nội thất phòng thờ,cúng) */
router.get('/showProduct_worshipRoom',function(req,res,next){
  product.find({nhomsp:'Nội thất phòng thờ,cúng'},function(err,dulieu){
    res.render('viewProduct_worshipRoom',{title:'Danh sách sản phẩm phòng thờ,cúng',dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl })
  })
});
/* Show sản phẩm cho khách hàng(nhóm nội thất phòng ăn) */
router.get('/showProduct_diningRoom',function(req,res,next){
  product.find({nhomsp:'Nội thất phòng ăn'},function(err,dulieu){
    res.render('viewProduct_diningRoom',{title:'Danh sách sản phẩm phòng ăn',dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl })
  })
});
/*Trang (post) thêm sản phẩm */
router.post('/add_product',checkLogin,upload.single('anhsp'),function(req,res,next){
  for(i=0;i<=anhsp.length;i++){
    tenanh=anhsp[anhsp.length-1];
  }
  var sanpham={
    'tensp':req.body.tensp,
    'gia':req.body.gia,
    'mota':req.body.mota,
    'nhomsp':req.body.nhomsp,
    'soluong':req.body.soluong,
    'anhsp':tenanh
  }
  var dulieu= new product(sanpham);
  dulieu.save();
  res.redirect('/viewProduct');
})

/* Trang sửa thông tin tài khoản admin. */
router.get('/editAccount_admin/:idcansua',checkLogin, function(req, res, next) {
  var idcansua=req.params.idcansua;
  admin.find({_id:idcansua} , function(err, dulieu){
    res.render('editAccount_admin', { title: 'Sửa thông tin admin' , dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg });
    }); 
});
/* Trang (post) sửa thông tin tài khoản admin*/
router.post('/editAccount_admin/:idcansua',checkLogin, function(req, res, next) {
  var idcansua=req.params.idcansua;
  admin.findById(idcansua, function (err, dulieu) {
    if (err) return handleError(err);
    dulieu.email = req.body.email;
    dulieu.fullname = req.body.fullname;
    dulieu.password = (md5(req.body.password));
    dulieu.save();
    res.redirect('/viewAccount_admin'); 
  });
});
// //phân quyền
function checkLogin(req,res,next){
  if(!req.cookies.email){
    var loi=[];
    loi.push('Bạn phải đăng nhập với quyền quản trị !');
    res.render('login_admin', { title: 'Đăng nhập',loi:loi });
    return;
  }else{
    next();
  }
}
function checkLogin_client(req,res,next){
  if(!req.session.fullname){
    res.redirect('/login');
    return;
  }else {
    next();
  }
}
/* đăng kí(Post). */
router.post('/register', function(req, res, next) {
  var phantu={
    'email':req.body.email,
    'password':(md5(req.body.password)),
    'fullname':req.body.username,
    'gender':req.body.gender,
    'phone':req.body.phone,
    'address':req.body.address
  }
  var dulieu=new khach_hang(phantu);
  dulieu.save();
  res.redirect('/login');
});
/* add tài khoản admin */
router.post('/add_admin',upload.single('avtimg'),function(req,res,next){
  for(i=0;i<=tenimg.length;i++){
    tenavt=tenimg[tenimg.length-1];
  }
  var taikhoan={
    'email':req.body.email,
    'fullname':req.body.fullname,
    'password':(md5(req.body.password)),
    'avtimg':tenavt
  }
  var dulieu=new admin(taikhoan);
  dulieu.save();
  res.redirect('/viewAccount_admin');
});
/* Trang đăng nhập(post) vào trang quản trị. */
router.post('/login_admin',function(req,res,next){
  var email=req.body.email;
  var password=(md5(req.body.password));
  loi=[];
  admin.findOne({email:email},function(err,user){
    if(!user){
      loi.push('Tài khoản không tồn tại !');
      res.render('login_admin', { title: 'Đăng nhập',loi:loi });
      return;
    }
    if(user.password!=password){
      loi.push('Sai mật khẩu');
      res.render('login_admin', { title: 'Đăng nhập',loi:loi });
      return;
    }else{
      res.cookie('email',user.email);
      res.cookie('fullname',user.fullname);
      res.cookie('avtimg',user.avtimg);
      res.redirect('/admin');
    }
  })
  
})
/* Trang đăng nhập (post)*/
router.post('/login',function(req,res,next){
    var email=req.body.email;
    var mk=(md5(req.body.password));
    err=[];
    khach_hang.findOne({email:email},function(loi,user){
      if(!user){
        err.push('Tài khoản không tồn tại !');
        res.render('login',{title:'Đăng nhập',err:err});
        return;
      }
      if(user.password!=mk){
        err.push('Sai mật khẩu');
        res.render('login',{title:'Đăng nhập',err:err});
        return;
      }else{
        req.session.fullname=user.fullname;
        req.session.phone=user.phone;
        req.session.address=user.address;
        res.redirect('/');
      }
    });
  });

  /*TRang đặt hàng */
  router.get('/order/:idsp',function(req,res,next){
    var idsp=req.params.idsp;
    product.find({_id:idsp} , function(err, dulieu){
      res.render('order', { title: 'Mua hàng' , dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl });
      }); 
  });
 /*TRang đặt hàng(post) */
 router.post('/order/:idsp',function(req,res,next){
      var idsp=req.params.idsp;
      var soluong=req.body.sl;
      sessionid=req.signedCookies.sessionid;
      product.find({_id:idsp} , function(err, dulieu){
        dulieu.forEach(function(item){
          var tensp=item.tensp;
          var anhsp=item.anhsp;
          var giasp=item.gia;
          var order1={
            'tensp':tensp,
            'anhsp':anhsp,
            'giasp':giasp,
            'soluong':soluong,
            'sessionid':sessionid
          }
          var dulieu=new order(order1);
          dulieu.save();
          res.redirect('/cart');
        }); 
      }); 
  }); 
  /*Trang giỏ hàng */
  router.get('/cart',function(req,res,next){
    var sessionid=req.signedCookies.sessionid;
    var thanhtien=[]
    order.find({sessionid:sessionid},function(err,dulieu){
      dulieu.forEach(function(item){
        var gia=item.giasp;
        var soluong=item.soluong;
        thanhtien.push(gia*soluong);
        var tong=0;
        for(i=0;i<thanhtien.length;i++){
          tong=tong+parseInt(thanhtien[i]);
          req.session.tong=tong;
        }
      })
      req.session.sl=dulieu.length;
      res.render('cart',{title: 'Giỏ hàng' ,tong:req.session.tong, dulieu:dulieu,fullname:req.session.fullname,sl:req.session.sl });
    })
})
  /* Trang xóa sản phẩm trong giỏ hàng */
  router.get('/xoaspOrder/:idcanxoa',function(req,res,next){
    var idcanxoa=req.params.idcanxoa;
    order.findByIdAndRemove(idcanxoa).exec();
    res.redirect('/cart');
  })
/* Trang cập nhật lại số lượng thay đổi giá tiền */
router.post('/editspOrder/:idcansua',function(req,res,next){
  var idcansua=req.params.idcansua;
  order.findById({_id:idcansua},function(err,dulieu){
    if (err) return handleError(err);
    dulieu.soluong=req.body.soluong;
    dulieu.save();
    res.redirect('/cart');
  })
})
/* Trang hóa đơn */
router.post('/thanhtoan',checkLogin_client,function(req,res,next){
  var sessionid=req.signedCookies.sessionid;
  order.find({sessionid:sessionid},function(err,dulieu){
    dulieu.forEach(function(item){
      var hoa_don1={
        'fullname':req.session.fullname,
        'phone':req.session.phone,
        'address':req.session.address,
        'tensp':item.tensp,
        'soluong':item.soluong,
        'giasp':item.giasp,
        'tongtien':(parseInt(item.soluong))*(item.giasp)
      }
      var dulieu=new hoa_don(hoa_don1);
          dulieu.save();
    })
  })
  var sessionid=0;
  res.redirect('/');
})
router.get('/hoa_don',checkLogin,function(req,res,next){
    hoa_don.find({} , function(err, dulieu){
    res.render('bill', { title: 'Hóa đơn' , dulieu:dulieu,email:req.cookies.email,fullname:req.cookies.fullname,avtimg:req.cookies.avtimg });
    }); 
});
module.exports = router;
