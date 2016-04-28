// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');

// new WebpackDevServer(webpack(config), {
//   publicPath: config.output.publicPath,
//   hot: true,
//   historyApiFallback: true
// }).listen(3000, 'localhost', function (err, result) {
//   if (err) console.log(err);
//   console.log('Listening at localhost:3000');
// });

var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');

app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname,'favicon.ico')));
// app.use(express.static(path.join(__dirname,'src/img')));


app.get('/',function(req,res){
	res.sendFile( path.join(__dirname,'index.html') ) ;
})

app.listen(80);