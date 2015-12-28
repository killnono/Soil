console.log('hello,node');
//set up
var express = require('express');
var app = express();
var http = require('http')
var mongoose = require('mongoose');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); //


mongoose.connect('mongodb://localhost/test');
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log('Received message from client!');
    socket.on('login', function (user) {
        console.log('用户登录:', user);
        socket.emit('message', user.username + '欢迎登录');
    });
});

server.listen(3000, function () {
    console.log("App listening on port 3000");
});
//app.listen(3000);


// models
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var BookSchema = new Schema({
    name: String,
    type: String,
    borrow: String,
    desc: String,
    isBuy: {
        type: Boolean,
        default: false
    }
});
mongoose.model('Book', BookSchema);
var Book = mongoose.model('Book');
/**--routes**/
//get all todos
app.get('/api/books', function (req, res) {
    //res.send('haahahah');
    Book.find(function (err, books) {
        if (err) {
            res.send(err)
        } else {
            res.send(books)
        }
    });
});

app.get('', function (req, res) {
    res.sendfile('./public/index.html')
});

/**
 * add a book
 */
app.post('/api/book/create', function (req, res) {
    Book.create({
            name: req.body.name,
            have: "",
            isBuy: true
        }, function (err, book) {
            if (err) {
                res.send(err);
            } else {
                console.log('create succeed :' + book);
                Book.find(function (err, books) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(books);
                    }
                });

            }
        }
    );
});


/**
 * update a book
 */
app.post('/api/book/update', function (req, res) {
    console.log(req.body);
    var conditions = {_id: req.body._id};
    var updateArg = {$set: req.body};
    var options = {upsert: false};

    Book.update(conditions, updateArg, options, function (err, data) {
        if (err) {
            res.send(err)
        } else {
            console.log('The number of updated documents was %d', data);
            res.send("update succeed")
        }
    });
});

app.delete('/api/book/:book_id', function (req, res) {
    Book.remove({_id: req.params.book_id}, function (err, count) {
        if (err) {
            res.send(err);
        } else {
            console.log('delete succeed :' + count);
            Book.find(function (err, books) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(books);
                }
            });

        }
    });
});

//打渠道包
app.get('/api/channel/:channel', function (req, res) {

    //1为本地,0为线上
    var env = 0;
    var channel = req.params.channel;

    var packageDir;//打包项目的路径
    var packageOutputDir;//打完包输出的文件夹
    var apkName = 'YCMath_Android_V2.0.0_' + channel + '.apk';//apk文件名

    if (env == 1) {
        packageDir = '~/Desktop/WorkSpace_Guanghe/repository/YCMath345-Android/'
        packageOutputDir = '/Users/killnono/Desktop/WorkSpace_Guanghe/repository/YCMath345-Android/YCMath/build/outputs/apk';

    } else {
        packageDir = '/home/master/package_repository/YCMath345-Android/'
        packageOutputDir = '/home/master/package_repository/YCMath345-Android/YCMath/build/outputs/apk';

    }

    var shell = require('shelljs');
    var fs = require('fs');
    shell.exec('./package_run.sh ' + packageDir + " " + channel, function (code, output) {
        console.log('code = ' + code);
        if (code == 0) {
            var oldPath = packageOutputDir + '/' + apkName;
            var newPath = __dirname + '/public/apks/' + apkName;
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    console.log('meaasge', ' rename apk path err:' + err);
                    io.emit('message', 'rename err' + err);
                } else {
                    console.log(' exec succeed,apk path = ' + newPath);
                    io.emit('packageDone', 'apks/' + apkName);
                }
            });

        } else {
            io.emit('message', 'exec sh error:' + output);
        }

    });

    res.send('正在打包,请等待');


});
