const fs = require('fs');
const http = require('http');
const url = require('url');
// const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
// external css and image file
const css = fs.readFileSync("./style.css")
const hero=fs.readFileSync('./hero.png')
// data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);

// main server and work
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // css
  }else if(req.url==='/style.css'){
    
    res.writeHead(200, { 'Content-Type': 'text/css' })
    res.write(css)
    res.end()
    // image
  } else if(req.url==='/hero.png'){
    res.writeHead(200, { 'Content-Type': 'image/png'})
    
    res.write(hero)
    res.end()
  }
  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, () => {
  console.log('Listening to requests on port 8000');
});
