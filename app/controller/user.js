const category=require('../models/category');
const website= require('../models/website')
exports.coupon_by_company = async (req, res) => {
  try {
    const { company } = req.body;
    if (!company) {
      return res.status(400).json({ message: 'company field is required' });
    }

   
    const allCategoryPosts = await category.find({ company: company, couponstatus: 'true' });
    const websites = await website.find({ Name: company }, { postimage: 1 });

    res.json({
      status: true,
      message: 'All coupons retrieved successfully',
      posts: allCategoryPosts,
      websites: websites, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.allcoupon = async (req, res) => {
  try {
    const allCategoryPosts = await category.find({ couponstatus: 'true' ,status:'active'});

    const combinedData = [];

    for (const post of allCategoryPosts) {
      const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

     
      const combinedPost = {
        ...post.toObject(),
        website: websiteData ? websiteData.postimage : [],
      };

      combinedData.push(combinedPost);
    }

    res.json({
      status: true,
      message: 'All coupons retrieved successfully',
      data: combinedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.flashdeals = async (req, res) => {
  try {
    const allCategoryPosts = await category.find({ couponstatus: 'false', discount: { $gte: 50 },status:'active'});

    const combinedData = [];

    for (const post of allCategoryPosts) {
      const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

      const combinedPost = {
        ...post.toObject(),
        website: websiteData ? websiteData.postimage : [],
      };

      combinedData.push(combinedPost);
    }

    res.json({
      status: true,
      message: 'All coupons retrieved successfully',
      data: combinedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.allproducts = async (req, res) => {
  try {
    const allCategoryPosts = await category.find({ couponstatus: 'false',status:'active' });

    const combinedData = [];

    for (const post of allCategoryPosts) {
      const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

      const combinedPost = {
        ...post.toObject(),
        website: websiteData ? websiteData.postimage : [],
      };

      combinedData.push(combinedPost);
    }

    res.json({
      status: true,
      message: 'All coupons retrieved successfully',
      data: combinedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.topdeals = async (req, res) => {
  try {
    const allCategoryPosts = await category.find( {status:'active', couponstatus: 'false'});

    const combinedData = [];

    for (const post of allCategoryPosts) {
      const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

      const combinedPost = {
        ...post.toObject(),
        website: websiteData ? websiteData.postimage : [],
      };

      combinedData.push(combinedPost);
    }

    res.json({
      status: true,
      message: 'All coupons retrieved successfully',
      data: combinedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.couponcompany = async (req, res) => {
  try {
    const { maincategory } = req.body;
    const allCategoryPosts = await category.find({ maincategory: maincategory, couponstatus: 'true' });

    // Create an object to store the website data with counts and images
    const websiteData = {};

    // Filter websites that match a company name in the posts collection
    const matchingWebsites = [];

    // Loop through allCategoryPosts and collect unique company names
    const uniqueCompanyNames = [...new Set(allCategoryPosts.map((categoryPost) => categoryPost.company))];

    // Find websites for the unique company names and store their images and initialize count to 0
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

    // Loop through allCategoryPosts and count the data for each website
    for (const categoryPost of allCategoryPosts) {
      const websiteName = categoryPost.company;
      if (websiteData[websiteName]) {
        websiteData[websiteName].count++;
      }
    }

    // Filter posts to include only those with company names matching the websites
    const matchingPosts = allCategoryPosts
      .filter((categoryPost) => matchingWebsites.includes(categoryPost.company))
      .map((categoryPost) => ({
        ...categoryPost._doc, // Copy all properties from categoryPost
        companyName: categoryPost.company, // Add company name to the post
        websiteName: categoryPost.company, // Add website name to the post (you can update this if needed)
        websiteImage: websiteData[categoryPost.company].image, // Add matching website image to the post
      }));

    // Filter websites to include only matching websites
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
      posts: matchingPosts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};






  exports.couponsubcategory = async (req, res) => {
    try {
      const { categorys } = req.body;
      const allCategoryPosts = await category.find({ categorys: categorys, couponstatus: 'true' });
  
      // Create an object to store the website data with counts and images
      const websiteData = {};
  
      // Filter websites that match a company name in the posts collection
      const matchingWebsites = [];
  
      // Loop through allCategoryPosts and collect unique company names
      const uniqueCompanyNames = [...new Set(allCategoryPosts.map((categoryPost) => categoryPost.company))];
  
      // Find websites for the unique company names and store their images and initialize count to 0
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
  
      // Loop through allCategoryPosts and count the data for each website
      for (const categoryPost of allCategoryPosts) {
        const websiteName = categoryPost.company;
        if (websiteData[websiteName]) {
          websiteData[websiteName].count++;
        }
      }
  
      // Filter posts to include only those with company names matching the websites
      const matchingPosts = allCategoryPosts
        .filter((categoryPost) => matchingWebsites.includes(categoryPost.company))
        .map((categoryPost) => ({
          ...categoryPost._doc, // Copy all properties from categoryPost
          companyName: categoryPost.company, // Add company name to the post
          websiteName: categoryPost.company, // Add website name to the post (you can update this if needed)
          websiteImage: websiteData[categoryPost.company].image, // Add matching website image to the post
        }));
  
      // Filter websites to include only matching websites
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
        posts: matchingPosts,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.couponbywebsite = async (req, res) => {
    
      try {
        const {company}=req.body;
        const allCategoryPosts = await category.find({ company:company,couponstatus: 'true' });
    
        const combinedData = [];
    
        for (const post of allCategoryPosts) {
          const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });
    
          const combinedPost = {
            ...post.toObject(),
            websiteImage: websiteData ? websiteData.postimage : [],
          };
    
          combinedData.push(combinedPost);
        }
    
        res.json({
          status: true,
          message: 'All coupons retrieved successfully',
          posts: combinedData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };
  
  
  //   exports.search = async (req, res) => {
  //     try {
  //         const { query } = req.body;
  //         if (!query) {
  //             return res.status(400).json({ message: 'query field is required' });
  //         }
   
  //         const categoryResults = await category.find({
  //           $and: [ 
  //               {
  //                   $or: [
  //                       { categorys: { $regex: new RegExp(query, 'i') } },
  //                       { maincategory: { $regex: new RegExp(query, 'i') } },
  //                       { company: { $regex: new RegExp(query, 'i') } },
  //                       { Name: { $regex: new RegExp(query, 'i') } },
  //                   ],
  //               },
  //                { couponstatus: 'true' }, 
  //           ],
  //       });
  //         const combinedData = [];
    
  //         for (const post of categoryResults) {
  //           const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });
      
  //           const combinedPost = {
  //             ...post.toObject(),
  //             websiteImage: websiteData ? websiteData.postimage : [],
  //           };
      
  //           combinedData.push(combinedPost);
  //         }
  //     res.json({
  //             status: true,
  //             message: 'Search results retrieved successfully',
  //             data: combinedData,
  //         });
  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).json({ message: 'Internal server error' });
  //     }
  // };
  exports.search = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: 'query field is required' });
        }

        const categoryResult1 = await category.find({
            $and: [
                {
                    $or: [
                        { categorys: { $regex: new RegExp(query, 'i') } },
                        { maincategory: { $regex: new RegExp(query, 'i') } },
                        { company: { $regex: new RegExp(query, 'i') } },
                        { Name: { $regex: new RegExp(query, 'i') } },
                    ],
                },
                { couponstatus: 'false' },
            ],
        });

        const categoryResults = await category.find({
            $and: [
                {
                    $or: [
                        { categorys: { $regex: new RegExp(query, 'i') } },
                        { maincategory: { $regex: new RegExp(query, 'i') } },
                        { company: { $regex: new RegExp(query, 'i') } },
                        { Name: { $regex: new RegExp(query, 'i') } },
                    ],
                },
                { couponstatus: 'true' },
            ],
        });

        const products = [];
        const coupons = [];

        for (const post of categoryResult1) {
            const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

            const combinedPost = {
                ...post.toObject(),
                websiteImage: websiteData ? websiteData.postimage : [],
            };

            products.push(combinedPost);
        }

        for (const post of categoryResults) {
            const websiteData = await website.findOne({ Name: post.company }, { postimage: 1 });

            const combinedPost = {
                ...post.toObject(),
                websiteImage: websiteData ? websiteData.postimage : [],
            };

            coupons.push(combinedPost);
        }

        res.json({
            status: true,
            message: 'Search results retrieved successfully',
            data: {
                products,
                coupons,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


  exports.stores = async (req, res) => {
    try {
      
      const allCategoryPosts = await category.find({couponstatus: 'true' });
  
      
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
       // posts: matchingPosts,
        highestCountWebsite: highestCountWebsite, 
        highestCount: highestCount, 
        highestCountWebsiteImage: highestCountWebsiteImage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  

  