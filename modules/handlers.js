var fs = require('fs');
var formidable = require('formidable');
var mv = require('mv');
var path;

exports.welcome = function(request, response) {
  console.log("Rozpoczynam obsługę żądania welcome.");
  fs.readFile('templates/start.html', function(err, html) {
    if (err) { 
      response.write("404 :(");
      response.end();
      console.log('Could not load site!'.red);
      console.log(err);
      return;
    }
    else {
      response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      response.write(html);
      response.end();
    };
  });
};

exports.upload = function(request, response) {
  console.log("Rozpoczynam obsługę żądania upload.");
  var form = new formidable.IncomingForm();
  form.uploadDir = "./uploaded-images"; 
  form.keepExtensions = true;
  form.parse(request, function(err, fields, files) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
    path = "uploaded-images/" + files.upload.name;
    path = path.toString();

    mv(files.upload.path, path, function(err) {
      if (err) {
        console.log('Could not upload image'.red);
        console.log(err);
      }
      else {
        console.log('Saved to directory'.cyan);
      };
    });
  });
};

exports.show = function(request, response) {
  fs.readFile(path, "binary", function(err, file) {
    if (err) { 
      console.log('Image could not be shown'.red);
      console.log(err);
      return;
    }
    else {
      console.log ('Showing your image...'.cyan);
      response.writeHead(200, {"Content-Type": "image/png"});
      response.write(file, "binary");
      response.end();
    };
  });
}

exports.error = function(request, response) {
  console.log("Nie wiem co robić.");
  response.write("404 :(");
  response.end();
}