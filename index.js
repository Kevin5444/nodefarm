const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate')




///////////////////////////////////////////////////////////////////////////////////////
//////Files

//Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOutput = `This is what we know about the ovacado: ${textIn}. \nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOutput);

// console.log('File written succesfully');


//Non Blocking, asynchtronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1);

//     fs.readFile(`./txt/${data1}`, 'utf8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//                 console.log('Your file has been written');
//             })
//         })
//     })
// })


////////////////////////
////Server


const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true)

    //overview-page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace(/%PRODUCT_CARDS%/g, cardsHtml)
        
        res.end(output);

    //product-page
    } else if(pathname === '/product'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API
    } else if(pathname === '/api') {
            res.writeHead(200, {
                'Content-Type': 'application/json'
            })
            res.end(data);
    //Not found
    }else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });
        res.end('<h1>Page not found!</h1>');
    }
});


server.listen(8000, '127.0.0.1', () => {
    console.log('The server is listening on port 8000')
})