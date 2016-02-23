//var express = require('express');
//var compression = require('compression');
//var fs = require('fs');
//var app = express();
//

//app.use('/static', express.static('static'));
//
//var port = process.env.PORT || 3000
//app.listen(port);
//console.log("App started on port: " + port);

var webpack = require('webpack')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000


const compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));

app.use(function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
