var express = require('express');
var app = express();

// app.set('view engine','ejs');
// app.use('/css',express.static(__dirname+'/css'));
// app.set('views',__dirname+'/views');


app.get('/', function(req,res){
		res.sendFile(__dirname+'/index.html');
		// res.render('index',{name:'chocking'},function(err,html){
		// 	res.send(html)
		// });
})






app.listen(1337,'127.0.0.1');

