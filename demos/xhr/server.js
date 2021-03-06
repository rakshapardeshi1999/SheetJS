#!/usr/bin/env node
/* xlsx.js (C) 2013-present  SheetJS -- http://sheetjs.com */

var fs = require('fs'), path = require('path');
var express = require('express'), app = express();
var sprintf = require('printj').sprintf;

function logit(req, res, next) {
	console.log(sprintf("%s %s %d", req.method, req.url, res.statusCode));
	next();
}
function cors(req, res, next) {
	if(!res.headersSent) res.header('Access-Control-Allow-Origin', '*');
	next();
}

var port = +process.argv[2] || +process.env.PORT || 7262;
var basepath = process.cwd();

var dir = path.join(__dirname, "files");
try { fs.mkdirSync(dir); } catch(e) {}

app.use(logit);
app.use(cors);
app.use(require('express-formidable')({uploadDir: dir}));
app.post('/upload', function(req, res) {
	console.log(req.files);
	var f = req.files[Object.keys(req.files)[0]];
	var newpath = path.join(dir, f.name);
	fs.renameSync(f.path, newpath);
	console.log("moved " + f.path + " to " + newpath);
	res.end("wrote to " + f.name);
});
app.use(express.static(path.resolve(basepath)));
app.use(require('serve-index')(basepath, {'icons':true}));

app.listen(port, function() { console.log('Serving HTTP on port ' + port); });

