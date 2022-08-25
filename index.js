const fs = require('fs')
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const hello = 'Hello World!';
console.log(hello);


// fs.readFile('txt/start.txt', 'utf-8', (err, data) =>{
//     if (err) return console.log('ERRORRRRRRRRRRRRR');
//     fs.readFile(`txt/${data}.txt`, 'utf-8', (err, data1) =>{
//         console.log(data1);
//         fs.readFile(`txt/append.txt`, 'utf-8', (err, data2) =>{
//             console.log(data2);

//             fs.writeFile('txt/final.txt', `${data1}\n${data2}`, 'utf-8', err => {
//                 console.log('Your file has been written succesfully!!');
//             });
//         });
//     });
// });
// console.log('Will read file!');

//===============================================================
//SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {
    const {query, pathname} = (url.parse(req.url, true));
    const pathName = req.url;
    // Overview Page
    if(pathName === '/' || pathName === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(`{%PRODUCT_CARDS%}`, cardsHtml);
        res.end(tempOverview);

    // Product Page
    } else if (pathName === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
        
    // API    
    } else if (pathName === '/api') {
            res.writeHead(200, { 'Content-type': `application/json`});
            res.status();
            res.end(data);
            
    //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to request')
});