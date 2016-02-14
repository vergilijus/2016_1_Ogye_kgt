var express = require('express'),
    errorHandler = require('errorhandler'),
    app = express();

var HOSTNAME = 'localhost',
    PORT = 8080,
    PUBLIC_DIR = __dirname + '/public_html';

// TODO: Узнать что принимают параметры. Пофиксить имена.
app.use(function (req, res, done) {
    done();
    // Здесь нужно написать журналирование в формате
    // (журналирование - вывод в консоль)
    // [время] [номер запроса по счету]
});

app
    .use('/', express.static(PUBLIC_DIR))
    .use(errorHandler());

app.listen(PORT, function () {
    console.log("Simple static server showing %s listening at http://%s:%s", PUBLIC_DIR, HOSTNAME, PORT);
});
