require('babel-polyfill');
require('babel-register');
var webpack = require('webpack')
var config = require('./webpack.config')
var express = require('express');
var app = new express();
var port = 3000
var graphql = require('graphql').graphql
var Schema = require('./src/schema');
var bodyParser = require('body-parser');
const compiler = webpack(config);
const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

app.use(bodyParser.json());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));
app.use(require('webpack-hot-middleware')(compiler));
app.use('/static', express.static('static'));
app.use('/graphql', function(req, res) {
  const {query, variables} = req.body;
  const authToken = req.user || {};
  const context = {authToken};
  graphql(Schema, query, null, context, variables)
    .then(result => {
      if (result.errors) {
        console.log('DEBUG GraphQL Error:', result.errors);
      }
      return result;
    })
    .then(result => {
      delay().then(() => res.send(result))
    })

});
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/index.html')
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
