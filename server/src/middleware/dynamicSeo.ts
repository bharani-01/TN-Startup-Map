import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { StartupRepository } from '../repositories/StartupRepository.js';
import { BlogRepository } from '../repositories/BlogRepository.js';
import { DistrictRepository } from '../repositories/DistrictRepository.js';

const startupRepo = new StartupRepository();
const blogRepo = new BlogRepository();
const districtRepo = new DistrictRepository();

const BASE_URL = process.env.VITE_PUBLIC_URL || 'https://tnstartupmaps.trackifyapp.co.in';
const DEFAULT_IMAGE = `${BASE_URL}/logo.webp`;

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function createDynamicSeoHandler(distPath: string) {
  const indexPath = path.join(distPath, 'index.html');

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || !fs.existsSync(indexPath)) {
      return next();
    }

    try {
      let rawHtml = fs.readFileSync(indexPath, 'utf8');
      const pathname = req.path;

      let title = 'Tamil Nadu Startup Connect — Innovation & Venture Directory';
      let description = 'Explore startups, founders, investors, incubators, jobs, and the innovation ecosystem across Tamil Nadu\'s 38 districts.';
      let ogUrl = `${BASE_URL}${pathname}`;
      let ogImage = DEFAULT_IMAGE;
      let ogType = 'website';
      let twitterCard = 'summary_large_image';

      // 1. Dynamic Startup Detail Page (/startups/:slug)
      const startupMatch = pathname.match(/^\/startups\/([a-zA-Z0-9_-]+)$/);
      if (startupMatch) {
        const slug = startupMatch[1];
        const startup = await startupRepo.findBySlug(slug);
        if (startup) {
          title = `${startup.name} — Tamil Nadu Startup Connect`;
          description = startup.tagline || startup.description || `${startup.name} is a ${startup.stage || ''} startup located in ${startup.district}, Tamil Nadu.`;
          ogUrl = `${BASE_URL}/startups/${startup.slug}`;
          ogImage = startup.logoUrl || DEFAULT_IMAGE;
          twitterCard = startup.logoUrl ? 'summary' : 'summary_large_image';
        }
      }

      // 2. Dynamic Blog Detail Page (/blog/:slug)
      const blogMatch = pathname.match(/^\/blog\/([a-zA-Z0-9_-]+)$/);
      if (blogMatch && blogMatch[1] !== 'new' && !blogMatch[1].startsWith('edit')) {
        const slug = blogMatch[1];
        const blog = await blogRepo.findBySlug(slug);
        if (blog) {
          title = `${blog.title} — Tamil Nadu Startup Connect`;
          description = blog.subtitle || blog.title;
          ogUrl = `${BASE_URL}/blog/${blog.slug}`;
          ogImage = blog.coverImageUrl || DEFAULT_IMAGE;
          ogType = 'article';
        }
      }

      // 3. Dynamic District Detail Page (/districts/:slug)
      const districtMatch = pathname.match(/^\/districts\/([a-zA-Z0-9_-]+)$/);
      if (districtMatch) {
        const slug = districtMatch[1];
        const district = await districtRepo.findBySlug(slug);
        if (district) {
          title = `${district.name} District — Tamil Nadu Startup Connect`;
          description = `Explore startups, innovation hubs, and founders across ${district.name}, Tamil Nadu.`;
          ogUrl = `${BASE_URL}/districts/${district.slug}`;
        }
      }

      // 4. Static Top-level Directory Pages
      if (pathname === '/startups') {
        title = 'Startups Directory — Tamil Nadu Startup Connect';
        description = 'Browse and filter verified startups across Tamil Nadu\'s 38 districts by sector, stage, and district.';
      } else if (pathname === '/map') {
        title = 'Interactive Startup Map — Tamil Nadu Startup Connect';
        description = 'Explore clusters, district boundaries, and verified innovation ventures across all 38 districts on an interactive map.';
      } else if (pathname === '/jobs') {
        title = 'Jobs & Career Opportunities — Tamil Nadu Startup Connect';
        description = 'Find verified startup jobs and career opportunities across technology, product, design, and operations in Tamil Nadu.';
      } else if (pathname === '/blog') {
        title = 'Ecosystem Stories & Founder Insights — Tamil Nadu Startup Connect';
        description = 'Read engineering breakthroughs, manufacturing playbooks, and venture building stories from Tamil Nadu founders.';
      } else if (pathname === '/submit') {
        title = 'Submit Your Startup — Tamil Nadu Startup Connect';
        description = 'List your venture on Tamil Nadu\'s premier startup map and ecosystem directory.';
      }

      // Replace metadata dynamically inside rawHtml
      let finalHtml = rawHtml;

      // Replace <title>...</title>
      finalHtml = finalHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

      // Replace Meta Description
      finalHtml = finalHtml.replace(/<meta name="description" content=".*?" \/>/i, `<meta name="description" content="${escapeHtml(description)}" />`);

      // Replace Canonical
      finalHtml = finalHtml.replace(/<link rel="canonical" href=".*?" \/>/i, `<link rel="canonical" href="${escapeHtml(ogUrl)}" />`);

      // Replace Open Graph Tags
      finalHtml = finalHtml.replace(/<meta property="og:title" content=".*?" \/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
      finalHtml = finalHtml.replace(/<meta property="og:description" content=".*?" \/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
      finalHtml = finalHtml.replace(/<meta property="og:url" content=".*?" \/>/i, `<meta property="og:url" content="${escapeHtml(ogUrl)}" />`);
      finalHtml = finalHtml.replace(/<meta property="og:image" content=".*?" \/>/i, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
      finalHtml = finalHtml.replace(/<meta property="og:image:secure_url" content=".*?" \/>/i, `<meta property="og:image:secure_url" content="${escapeHtml(ogImage)}" />`);
      finalHtml = finalHtml.replace(/<meta property="og:type" content=".*?" \/>/i, `<meta property="og:type" content="${escapeHtml(ogType)}" />`);

      // Replace Twitter Card Tags
      finalHtml = finalHtml.replace(/<meta name="twitter:card" content=".*?" \/>/i, `<meta name="twitter:card" content="${escapeHtml(twitterCard)}" />`);
      finalHtml = finalHtml.replace(/<meta name="twitter:title" content=".*?" \/>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
      finalHtml = finalHtml.replace(/<meta name="twitter:description" content=".*?" \/>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
      finalHtml = finalHtml.replace(/<meta name="twitter:image" content=".*?" \/>/i, `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`);

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(200).send(finalHtml);
    } catch (err) {
      console.error('Error during dynamic SEO generation:', err);
      return res.sendFile(indexPath);
    }
  };
}
