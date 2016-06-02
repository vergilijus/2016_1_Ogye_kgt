var express = require('express'),
    errorHandler = require('errorhandler'),
    app = express(),
    proxy = require('express-http-proxy');

var HOSTNAME = 'localhost',
    PORT = 8080,
    PUBLIC_DIR = __dirname + '/public_html';

var i = 0;

app.use(function (req, res, done) {
    var date = new Date();
    console.log('[' + date.toLocaleString() + '] [Request no.' + i++ + ']');
    done();
});

app
    .use('/', express.static(PUBLIC_DIR))
    .use(errorHandler());

app.listen(PORT, function () {
    console.log("Simple static server showing %s listening at http://%s:%s", PUBLIC_DIR, HOSTNAME, PORT);
});


app.use('/api', proxy('localhost:8089', {
    forwardPath: function (req, res) {
        return require('url').parse(req.url).path;
    }
}));

app.put('/api/session', function(req, res) {
    var username = req.body.login;
    var password = req.body.password;
    var newurl = 'http://localhost:80/api/session/';
    request({ url: newurl, method: 'PUT', json: {login: username, password: password}}).pipe(res);
});

app.put('/api/user', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;
    var newurl = 'http://localhost:80/api/user';
    request({ url: newurl, method: 'PUT', json: {login: login, password: password}}).pipe(res);
});

app.delete('/api/session', function(req, res) {
    var newurl = 'http://localhost:80/api/session';
    request({ url: newurl, method: 'DELETE'}).pipe(res);
});

app.get('/api/session', function(req, res) {
    req.pipe(request('http://localhost:80' + req.url)).pipe(res);
});
app.get('/api/user',function(req,res) {
    req.pipe(request('http://localhost:80' + req.url)).pipe(res);
});
