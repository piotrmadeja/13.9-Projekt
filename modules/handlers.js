var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');
var path;

exports.upload = function(request, response) {
  console.log("Rozpoczynam obsługę żądania upload.");
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploaded-images"; 
  form.keepExtensions = true;
  form.parse(request, function(error, fields, files) {

  	path = "uploaded-images/" + files.upload.name;
    path = path.toString();

    mv(files.upload.path, path, function(err)
    {if(err) throw error;
    console.log('Saved to directory');
    });

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}

exports.show = function(request, response) {
  fs.readFile("test.png", "binary", function(error, file) {
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
  });
}

exports.welcome = function(request, response) {
  console.log("Rozpoczynam obsługę żądania welcome.");
  fs.readFile('templates/start.html', function(err, html) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    response.write(html);
    response.end();
  });
}

exports.error = function(request, response) {
  console.log("Nie wiem co robić.");
  response.write("404 :(");
  response.end();
}