var app = require('http').createServer(response)
var fs = require('fs')
async function response(req, res) {
    /*
    This function handles incoming HTTP requests and returns data
     */
    var file = "";
    if (req.url === "/" || req.url.slice(0, 4) === "/tts") {
        file = __dirname + "/demo.html"
    } else {
        file = __dirname + req.url;
    }


    fs.readFile(file,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Page or file not found');
            }
            //set the correct MIME type
            if (req.url.substr(-3) === ".js") {
                res.setHeader("Content-Type", "text/javascript")
            } else if (req.url.substr(-4) === ".css") {
                res.setHeader("Content-Type", "text/css")
            }

            res.writeHead(200);

            res.end(data);
        }
    );

}
//start http server on port 3000 or process port for Heroku
app.listen(process.env.PORT || 3000);
