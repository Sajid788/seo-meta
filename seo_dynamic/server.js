import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PassThrough } from 'stream';
import { render } from './dist/server/entry-server.js';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: '*' }));

const template = fs.readFileSync(path.join(__dirname, 'dist/index.html'), 'utf-8');
app.use('/assets', express.static(path.join(__dirname, 'dist/client/assets')));

// Simple in-memory cache
const cache = new Map();

function getPageData(url) {
  if (url.startsWith('/post/')) {
    const id = url.split('/')[2] || '123';
    return {
      title: `Post #${id} - Amazing Content 🚀`,
      description: `Check out this amazing post #${id}! This demonstrates dynamic SSR with WhatsApp and Twitter previews.`,
      image: `https://picsum.photos/seed/post${id}/1200/630`,
    };
  }
  return {
    title: 'React SSR Demo - Dynamic Meta Tags',
    description: 'Server-side rendered React app with dynamic OG tags for WhatsApp, Twitter, and Facebook previews',
    image: 'https://picsum.photos/seed/home/1200/630',
  };
}

app.get('*', async (req, res) => {
  const url = req.originalUrl;
  const cacheKey = url;
  if (cache.has(cacheKey)) return res.send(cache.get(cacheKey));

  const pageData = getPageData(url);
  
  // Get the full URL for OG tags (use actual host from request)
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3000';
  const fullUrl = `${protocol}://${host}${url}`;

  // Inject head + data
  const [head, tail] = template.split('<div id="root"></div>');
  
  // Build comprehensive meta tags for WhatsApp/Twitter/Facebook
  const metaTags = `
    <meta name="description" content="${pageData.description}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${fullUrl}">
    <meta property="og:title" content="${pageData.title}">
    <meta property="og:description" content="${pageData.description}">
    <meta property="og:image" content="${pageData.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${fullUrl}">
    <meta name="twitter:title" content="${pageData.title}">
    <meta name="twitter:description" content="${pageData.description}">
    <meta name="twitter:image" content="${pageData.image}">
  `;

  res.status(200);
  res.set({ 'Content-Type': 'text/html', 'Cache-Control': 's-maxage=3600' });
  
  // Replace the title tag and add meta tags before </head>
  const updatedHead = head
    .replace(/<title>.*?<\/title>/, `<title>${pageData.title}</title>`)
    .replace('</head>', `${metaTags}</head>`);
  
  res.write(updatedHead);
  res.write('<div id="root">');

  // Create a PassThrough stream to detect when React stream finishes
  const reactStream = new PassThrough();
  // When React stream ends, write closing tags and end response
  reactStream.on('end', () => {
    res.write('</div>');
    res.write(`<script>window.__INITIAL_DATA__ = ${JSON.stringify(pageData)};</script>`);
    res.write(tail.replace('/*[[DATA]]*/null', ''));
    res.end();
  });
  
  // Pipe React stream through PassThrough to response
  const { pipe, abort } = render(url, pageData);
  pipe(reactStream);
  reactStream.pipe(res);
  
  // Handle errors
  reactStream.on('error', (err) => {
    console.error('Stream error:', err);
    abort();
    res.status(500).end();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SSR Server running → http://localhost:${PORT}`);
  console.log(`   Try: http://localhost:${PORT}/post/123`);
});





