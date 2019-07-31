const path = require('path')
const express = require("express");
const app = express();
const apiCallFromRequest = require('./Request')
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/notes', (req, res) =>
  apiCallFromRequest.callApi(function (response) {
    res.send(response);
  })
);

app.post('/notes', (req, res) =>
apiCallFromRequest.callPostApi(function (response) {
  res.send(response);
},req.body)
);

app.use('/', express.static('dist', { index: 'index.html' }));

app.listen(8080, () => console.log('Server listening on port 8080!'));

