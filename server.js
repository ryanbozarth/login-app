var express = require('express');
var app = express();
app.use(express.static('public'));
app.listen(process.env.PORT || 8080);

app.get('/', (req, res) => {
  res.status(200);
  res.sendFile(__dirname + '/build/index.html');
});





exports.app = app;
