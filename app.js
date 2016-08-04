var express = require('express');
require('ejs');

var app = express();

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static('app_client'));

app.use('/', function(req, res){
    res.redirect('/index.html');
});


app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});