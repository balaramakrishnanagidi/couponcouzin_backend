const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');

// Base URL of your site
const baseUrl = 'https://www.couponcouzin.com';

// Define your Angular routes
const routes = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/allDeals', changefreq: 'weekly', priority: 0.8 },
  { url: '/coupon/:category', changefreq: 'weekly', priority: 0.8 },
  { url: '/coupons', changefreq: 'weekly', priority: 0.8 },
  { url: '/search-results', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact-us', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/blogs', changefreq: 'weekly', priority: 0.8 },
  { url: '/security-tips', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/privacy-policy', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/terms-and-conditions', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/about-us', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/frequently-asked-questions', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/blog-details/:id', changefreq: 'weekly', priority: 0.8 }, // Fixed URL
  { url: '/search', changefreq: 'weekly', priority: 0.8 },
];

// Create the sitemap generation function
const generateSitemap = async () => {
  try {
    const smStream = new SitemapStream({ hostname: baseUrl });
    const pipeline = smStream.pipe(createGzip());

    // Write routes to the sitemap stream
    routes.forEach(route => smStream.write(route));

    smStream.end();

    // Save the sitemap to a file
    const sitemapPath = path.join('/var/www/html', 'sitemap.xml.gz');
    pipeline.pipe(fs.createWriteStream(sitemapPath)).on('finish', () => {
      console.log('Sitemap generated and saved successfully.');
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
};

generateSitemap();
