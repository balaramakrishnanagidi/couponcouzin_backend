const admin = require('../models/adminlogin');
const category = require('../models/category');
const website = require('../models/website');
const banners = require('../models/banner')

exports.adminlogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.findOne({ email: email });
    console.log(user)
    if (!user) {
      return res.status(401).send({ Status: false, message: 'Invalid email or password' });
    }
    if (user.password !== password) {
      return res.status(401).send({ Status: false, message: 'Invalid email or password' });
    }

    return res.status(200).json({ Status: 'true', message: 'Login successful,', user })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.categorypost = async (req, res) => {
  try {
    if (!req.body.Name || !req.body.maincategory || !req.body.price || !req.body.categorys || !req.body.company || !req.body.discount || !req.body.urlpath || !req.body.status || !req.body.metaTitle || !req.body.metaDescription || !req.body.primaryKeyword || !req.body.secondaryKeyword) {
      return res.status(400).json({ Status: false, message: "All fields are required" });
    }

    const { Name, price, categorys, company, discount, urlpath, status, maincategory, metaTitle, metaDescription, primaryKeyword, secondaryKeyword } = req.body;

    const postImages = req.files.map((file) => file.filename);

    const categoryPost = new category({
      Name,
      postimage: postImages,
      price,
      categorys,
      company,
      discount,
      urlpath,
      status,
      maincategory,
      metaTitle,
      metaDescription,
      primaryKeyword,
      secondaryKeyword,
    });

    const data = await categoryPost.save();

    res.status(201).json({
      Status: true,
      message: "Post created successfully!!",
      post: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateCategoryPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!req.body.Name || !req.body.price || !req.body.categorys || !req.body.company || !req.body.discount || req.body.urlpath) {
      return res.status(400).json({ Status: false, message: "All fields are required" });
    }

    const { Name, price, categorys, company, discount, urlpath } = req.body;

    const existingPost = await category.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ Status: false, message: 'Post not found' });
    }
    if (req.files && req.files.length > 0) {
      const postImages = req.files.map(file => file.filename);
      existingPost.postimage = postImages;
    }
    existingPost.Name = Name;
    existingPost.price = price;
    existingPost.categorys = categorys;
    existingPost.company = company;
    existingPost.discount = discount;
    existingPost.urlpath = urlpath
    const updatedData = await existingPost.save();

    res.json({
      Status: true,
      message: "Post updated successfully",
      updatedPost: updatedData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const { maincategory, categorys } = req.body;
    if (!maincategory || !categorys) {
      return res.status(400).json({ message: 'Both maincategory and categorys are required' });
    }
    const allCategoryPosts = await category.find({ maincategory, categorys, couponstatus: 'false' });

    res.json({
      status: true,
      message: 'All category posts retrieved successfully',
      posts: allCategoryPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllproducts = async (req, res) => {
  try {

    const allPosts = await category.find({ couponstatus: 'false' });

    res.json({
      Status: true,
      message: "All category posts retrieved successfully",
      posts: allPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



exports.deleteCategoryPost = async (req, res) => {
  try {
    const { postId } = req.params;


    const existingPost = await category.findOneAndRemove({ _id: postId });
    if (!existingPost) {
      return res.status(404).json({ Status: false, message: 'Category post not found' });
    }
    res.json({
      Status: true,
      message: 'Category post deleted successfully',
      deletedPost: existingPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addwebsite = async (req, res) => {
  try {
    if (!req.body.Name || !req.body.urlpath) {
      return res.status(400).json({ Status: false, message: "All fields are required" });
    }

    const { Name, urlpath } = req.body;
    const postImages = req.file.filename;
    const site = await website.findOne({ Name })
    if (site) {
      return res.status(400).json({ Status: false, message: "Name is already exstis" })
    }
    const categoryPost = new website({
      Name,
      postimage: postImages,
      urlpath,
    });

    const data = await categoryPost.save();

    res.status(201).json({
      Status: true,
      message: "Post created successfully!!",
      post: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updatestatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const { status } = req.body;

    if (!postId || !status) {
      return res.status(400).json({ Status: false, message: "postId and status are required fields" });
    }

    const updatedOrder = await category.findOneAndUpdate(
      { _id: postId },
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ Status: false, message: 'post not found' });
    }

    res.json({
      Status: true,
      message: 'status updated successfully',
      updatedOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.updatestatus = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { status } = req.body;

//     // Find the document by postId
//     const updatedOrder = await category.findOne({ _id: postId });

//     if (!updatedOrder) {
//       return res.status(404).json({ Status: false, message: 'post not found' });
//     }

//     // Update the status field
//     updatedOrder.status = status;

//     try {
//       // Save the updated document
//       const updatedData = await updatedOrder.save();

//       res.json({
//         Status: true,
//         message: 'status updated successfully',
//         updatedData,
//       });
//     } catch (saveError) {
//       console.error(saveError);
//       return res.status(500).json({ message: 'Error while saving the updated data' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.getallwebsites = async (req, res) => {
  try {
    const user = await website.find()

    res.status(200).json({ Status: true, data: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
exports.deleteWebsiteById = async (req, res) => {
  try {
    const websiteId = req.params.websiteId;


    const deletedWebsite = await website.findOneAndRemove({ _id: websiteId });

    if (!deletedWebsite) {
      return res.status(404).json({ message: 'Website not found.' });
    }

    res.status(200).json({ Status: true, message: 'Website deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// exports.newproductcount = async (req, res) => {
//   try {

//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
//     const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
//     const count = await category.countDocuments({
//       couponstatus: 'false',
//       createdAt: {
//         $gte: todayStart,
//         $lt: todayEnd
//       }
//     });
//     res.json({ Status: true, count: count });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.newproductcount = async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Subtract 1 hour from the current time

    // Set the start time to one hour ago
    const todayStart = new Date(
      oneHourAgo.getFullYear(),
      oneHourAgo.getMonth(),
      oneHourAgo.getDate(),
      oneHourAgo.getHours(),
      oneHourAgo.getMinutes(),
      oneHourAgo.getSeconds()
    );

    // Set the end time to the current time
    const todayEnd = now;

    const count = await category.countDocuments({
      couponstatus: 'false',
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    res.json({ Status: true, count: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.newcouponcount = async (req, res) => {
//   try {

//     const now = new Date();
//     const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
//     const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
//     const count = await category.countDocuments({
//       couponstatus: 'true',
//       createdAt: {
//         $gte: todayStart,
//         $lt: todayEnd
//       }
//     });
//     res.json({ Status: true, count: count });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.newcouponcount = async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // Subtract 1 hour from the current time

    // Set the start time to one hour ago
    const todayStart = new Date(
      oneHourAgo.getFullYear(),
      oneHourAgo.getMonth(),
      oneHourAgo.getDate(),
      oneHourAgo.getHours(),
      oneHourAgo.getMinutes(),
      oneHourAgo.getSeconds()
    );

    // Set the end time to the current time
    const todayEnd = now;

    const count = await category.countDocuments({
      couponstatus: 'true',
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd
      }
    });

    res.json({ Status: true, count: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.totalproducts = async (req, res) => {
  try {
    const user = await category.count({ couponstatus: 'false' })
    res.status(200).json({ Status: true, count: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
exports.totalwebsites = async (req, res) => {
  try {
    const user = await website.count()
    res.status(200).json({ Status: true, count: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

exports.totalcoupons = async (req, res) => {
  try {
    const user = await category.count({ couponstatus: true })
    res.status(200).json({ Status: true, count: user });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

exports.couponpost = async (req, res) => {
  try {
    if (!req.body.Name || !req.body.maincategory || !req.body.couponcode || !req.body.categorys || !req.body.company || !req.body.description || !req.body.urlpath || !req.body.status || !req.body.metaTitle || !req.body.metaDescription || !req.body.primaryKeyword || !req.body.secondaryKeyword) {
      return res.status(400).json({ Status: false, message: "All fields are required" });
    }

    const { Name, categorys, company, couponcode, description, urlpath, status, maincategory, metaTitle, metaDescription, primaryKeyword, secondaryKeyword } = req.body;

    const categoryPost = new category({
      Name,
      couponcode,
      categorys,
      company,
      description,
      urlpath,
      status,
      maincategory,
      metaTitle,
      metaDescription,
      primaryKeyword,
      secondaryKeyword,
      couponstatus: 'true',
    });

    const data = await categoryPost.save();

    res.status(201).json({
      Status: true,
      message: "Post created successfully!!",
      post: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllcoupons = async (req, res) => {
  try {
    const allPosts = await category.find({ couponstatus: 'true' });
    res.json({
      Status: true,
      message: "All coupon posts retrieved successfully",
      posts: allPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getcoupons = async (req, res) => {
  try {
    const { maincategory } = req.params;
    const allPosts = await category.find({ maincategory: maincategory, couponstatus: 'true' });
    res.json({
      Status: true,
      message: "All coupons retrieved successfully",
      posts: allPosts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.banner = async (req, res) => {
  try {
    const { url } = req.body;
    const postImages = req.file.filename;
    const categoryPost = new banners({
      bannerimage: postImages,
      url: url,

    });

    const data = await categoryPost.save();

    res.status(201).json({
      Status: true,
      message: "banner created successfully!!",
      post: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getbanner = async (req, res) => {
  try {

    const banner = await banners.find();

    res.status(200).json({ Status: true, message: 'banner  retrived successfully.', banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// exports.deletebanner=async(req,res)=>{
//   try {
//     const bannerId = req.params.bannerId;


//     const deletedWebsite = await banners.findOneAndRemove({   _id:bannerId});

//     if (!deletedWebsite) {
//       return res.status(404).json({ message: 'banner not found.' });
//     }

//     res.status(200).json({ Status: true, message: 'banner deleted successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }
const axios = require('axios');

exports.deletebanner = async (req, res) => {
  try {
    const bannerId = req.params.bannerId;


    const banner = await banners.findOne({ _id: bannerId });

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }
    const url = "http://couponcouzin.com/backend/couponcouzin/app/src/banner/"
    const imageURL = banner.imageURL;


    const deletedBanner = await banners.findOneAndRemove({ _id: bannerId });

    if (!deletedBanner) {
      return res.status(404).json({ message: 'Banner not found.' });
    }


    if (imageURL) {
      try {
        await axios.delete(imageURL);
        res.status(200).json({ Status: true, message: 'Banner and associated image deleted successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting the image URL.' });
      }
    } else {
      res.status(200).json({ Status: true, message: 'Banner deleted successfully.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.websites = async (req, res) => {
  try {

    const allCategoryPosts = await category.find({ couponstatus: 'false' });


    const websiteData = {};


    const matchingWebsites = [];


    const uniqueCompanyNames = [...new Set(allCategoryPosts.map((categoryPost) => categoryPost.company))];


    for (const companyName of uniqueCompanyNames) {
      const foundWebsite = await website.findOne({ Name: companyName });
      if (foundWebsite) {
        websiteData[companyName] = {
          count: 0,
          image: foundWebsite.postimage,
        };
        matchingWebsites.push(companyName);
      }
    }


    for (const categoryPost of allCategoryPosts) {
      const websiteName = categoryPost.company;
      if (websiteData[websiteName]) {
        websiteData[websiteName].count++;
      }
    }


    let highestCountWebsite = null;
    let highestCount = -1;

    for (const websiteName in websiteData) {
      if (websiteData[websiteName].count > highestCount) {
        highestCount = websiteData[websiteName].count;
        highestCountWebsite = websiteName;
      }
    }
    const highestCountWebsiteImage = highestCountWebsite ? websiteData[highestCountWebsite].image : null;

    const matchingPosts = allCategoryPosts
      .filter((categoryPost) => matchingWebsites.includes(categoryPost.company))
      .map((categoryPost) => ({
        ...categoryPost._doc,
        companyName: categoryPost.company,
        websiteName: categoryPost.company,
        websiteImage: websiteData[categoryPost.company].image,
      }));


    const filteredWebsites = Object.keys(websiteData)
      .filter((websiteName) => matchingWebsites.includes(websiteName))
      .map((websiteName) => ({
        Name: websiteName,
        count: websiteData[websiteName].count,
        image: websiteData[websiteName].image,
      }));

    res.json({
      status: true,
      message: 'All coupons companies retrieved successfully',
      websites: filteredWebsites,

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// savesta

const blogModel = require('../models/blog');
const commentModel = require('../models/comment');

exports.write_blog = async (req, res) => {
  try {
    const { title, coupon, itemUrl, contents, metaTitle, metaDescription, primaryKeyword, secondaryKeyword } = req.body;

    if (!req.file) {
      return res.status(400).json({ Status: false, message: "Image file not provided." });
    }

    const image = req.file.filename;

    if (!contents) {
      return res.status(400).json({ Status: false, message: "Contents is not provided!" })
    }

    if (!title || !coupon || !itemUrl) {
      return res.status(401).json({ Status: false, message: "Blog cannot be empty." })
    }

    const newBlog = new blogModel({
      title: title,
      coupon: coupon,
      itemUrl: itemUrl,
      contents: JSON.parse(contents),
      image: image,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      primaryKeyword: primaryKeyword,
      secondaryKeyword: secondaryKeyword
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({
      Status: true,
      message: "Blog posted successfully!",
      data: savedBlog
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, error: 'Internal Server Error' });
  }
};


exports.get_blogs = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res.status(200).json({ Status: true, message: "success!", data: blogs });
  } catch (error) {
    res.status(404).json({ Status: false, message: error.message });
  }
};

exports.blogs_by_type = async (req, res) => {
  try {
    const { coupon } = req.body;
    if (!coupon) {
      res.status(400).json({ Status: false, message: "Please provide the coupon of blogs" });
      return;
    }
    const blogs = await blogModel.find({ coupon: coupon });
    if (!blogs || blogs.length === 0) {
      res.status(404).json({ Status: false, message: "No blogs found for the specified coupon" });
    } else {
      res.status(200).json({ Status: true, message: "Success!", data: blogs });
    }
  } catch (error) {
    res.status(500).json({ Status: false, message: error.message });
  }
}

exports.blog_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ Status: false, message: "Please provide the blog id in params" });
      return;
    }
    const blog = await blogModel.find({ _id: id });
    if (!blog || blog.length === 0) {
      res.status(404).json({ Status: false, message: "No blog found for the specified id" });
    } else {
      res.status(200).json({ Status: true, message: "Success!", data: blog });
    }
  } catch (error) {
    res.status(500).json({ Status: false, message: error.message });
  }
}

exports.delete_blog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ Status: false, message: "provide blog id in proper way." })
      return;
    }
    const blog = await blogModel.findByIdAndDelete(id);
    if (!blog) {
      res.status(404).json({ Status: false, message: "Blog not found." });
    } else {
      res.status(200).json({ Status: true, message: "Blog deleted successfully!", data: blog });
    }
  } catch {
    res.status(500).json({ Status: false, message: error.message });
  }
}

exports.edit_blog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ Status: false, message: "Provide blog id in the proper way." });
    }

    const { title, coupon, itemUrl, contents, metaTitle, metaDescription, primaryKeyword, secondaryKeyword } = req.body;

    // Check if a new image is uploaded
    let image;
    if (req.file) {
      image = req.file.filename;
    }

    const updatedBlogData = {
      title,
      coupon,
      itemUrl,
      contents: JSON.parse(contents), // parsing contents again if coming from form-data
      metaTitle,
      metaDescription,
      primaryKeyword,
      secondaryKeyword
    };

    // Add image to update data if available
    if (image) {
      updatedBlogData.image = image;
    }

    // Find and update the blog by id
    const blog = await blogModel.findByIdAndUpdate(
      id,
      updatedBlogData,
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ Status: false, message: "Blog not found." });
    }

    return res.status(200).json({ Status: true, message: "Blog updated successfully!", data: blog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Status: false, message: error.message });
  }
};



//search for a blog
exports.search = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ Status: false, message: "Title not provided for search." });
    }

    // Use a regular expression to perform a case-insensitive search
    const regex = new RegExp(title, 'i');

    // Find blogs with titles that match the search query
    const searchResults = await blogModel.find({ title: regex });

    res.status(200).json({
      Status: true,
      message: "Search successful.",
      data: searchResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, error: 'Internal Server Error' });
  }
}



// Post a comment
exports.postComment = async (req, res) => {
  try {
    const { blogId, text, name, email, website } = req.body;

    if (!blogId) {
      res.status(400).json({ Status: false, message: "no blogId" });
    }

    if (!text) {
      res.status(400).json({ Status: false, message: "text" });

    }

    if (!name) {
      res.status(400).json({ Status: false, message: "name" });

    }

    if (!email) {
      res.status(400).json({ Status: false, message: "email" });

    }

    const newComment = new commentModel({
      blogId: blogId,
      text: text,
      name: name,
      email: email,
      website: website
    });

    const savedComment = await newComment.save();

    await blogModel.findByIdAndUpdate(blogId, { $push: { comments: savedComment._id } });

    res.status(201).json({
      Status: true,
      message: 'Comment posted successfully!',
      data: savedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, error: 'Internal Server Error' });
  }
};


// Get comments for a blog
exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await commentModel.find({ blogId }).sort({ createdAt: 'asc' });

    res.status(200).json({ Status: true, message: 'Success!', data: comments });
  } catch (error) {
    res.status(500).json({ Status: false, message: error.message });
  }
};

// Get comments by commentId
exports.getCommentsById = async (req, res) => {
  try {
    const { commentId } = req.body;
    const trimmedCommentId = commentId.trim();

    const comments = await commentModel.findById(trimmedCommentId);

    if (!comments) {
      return res.status(404).json({ Status: false, message: "Comments not found for the given commentId" });
    }

    res.status(200).json({ Status: true, message: 'Success!', data: comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Status: false, message: 'Internal server error' });
  }
};



// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentModel.findByIdAndDelete(id);

    // Remove the comment reference from the Blog
    await blogModel.updateOne({}, { $pull: { comments: id } });

    res.status(200).json({ Status: true, message: 'Comment deleted successfully!', data: comment });
  } catch (error) {
    res.status(500).json({ Status: false, message: error.message });
  }
};

