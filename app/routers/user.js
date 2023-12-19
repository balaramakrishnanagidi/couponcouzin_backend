const express = require('express');
const adminController = require("../controller/admin");
const userController =require('../controller/user');
const router = express.Router();
const {upload1} = require('../middleware/post');
const {upload} = require('../middleware/website');
const{upload3} = require('../middleware/banner');
const{upload4} = require('../middleware/blog');

//admin
router.post('/login',adminController.adminlogin);
router.post('/post',upload1.array('postimage'),adminController.categorypost);
router.put('/postupdate/:postId',upload1.array('postimage'),adminController.updateCategoryPost);
router.post('/getallcategories',adminController.getAllCategories);
router.get('/allproducts',adminController.getAllproducts)
router.delete('/deletepost/:postId',adminController.deleteCategoryPost);
router.post('/addwebsite',upload.single('image'),adminController.addwebsite)
router.get('/getallwebsites',adminController.getallwebsites);
router.delete('/deletewebsite/:websiteId',adminController.deleteWebsiteById);
router.get('/totalwebsites',adminController.totalwebsites);
router.put('/statusupdate/:postId',adminController.updatestatus);
router.get('/newproductcount',adminController.newproductcount);
router.get('/newcouponcount',adminController.newcouponcount);
router.get('/totalproducts',adminController.totalproducts);
router.post('/addcoupon',adminController.couponpost);
router.get('/getallcoupons',adminController.getAllcoupons);
router.get('/getcoupons/:maincategory',adminController.getcoupons);
router.get('/totalcoupons',adminController.totalcoupons);
router.post('/banner',upload3.single('image'),adminController.banner);
router.get('/getallbanner',adminController.getbanner);
router.delete('/deletebanner/:bannerId',adminController.deletebanner);
router.get('/websites',adminController.websites);
//user
router.post('/getcompanycoupon',userController.coupon_by_company);
router.get('/allcoupon',userController.allcoupon);
router.get('/alluserproducts',userController.allproducts);
router.get('/flashdeals',userController.flashdeals);
router.get('/topdeals',userController.topdeals)
router.post('/couponcompany',userController.couponcompany)
router.post('/couponsubcategory',userController.couponsubcategory)
router.post('/couponbywebsite',userController.couponbywebsite)
router.post('/search',userController.search);
router.get('/stores',userController.stores)


//Edited by savesta

//admin

router.post('/write_blog', upload4.single('image') ,adminController.write_blog);
router.get('/blogs', adminController.get_blogs);
router.post('/blogs_by_type', adminController.blogs_by_type);
router.get('/blog_by_id/:id', adminController.blog_by_id );
router.delete('/delete_blog/:id', adminController.delete_blog);
router.put('/edit_blog/:id', upload4.single('image'), adminController.edit_blog);
router.get('/search', adminController.search);
router.post('/post_comment', adminController.postComment);
router.get('/get_comments/:blogId', adminController.getComments);
router.post('/comments_by_id', adminController.getCommentsById);
router.delete('/delete_comment/:id', adminController.deleteComment);



module.exports = router;
