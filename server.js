console.log('hello,node');
//set up
var express = require('express');
var app = express();
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

// listen (start app with node onionBook.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");


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
    console.log('book  create ');
    Book.create({
            name: req.body.name,
            have: "",
            isBuy: true
        }, function (err, book) {
            if (err) {
                res.send(err);
            } else {
                res.send(book)
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

    var dir;
    if (env == 1) {
        dir = '~/Desktop/WorkSpace_Guanghe/repository/YCMath345-Android/ '
    } else {
        dir = '/home/master/package_repository/YCMath345-Android'
    }
    var shell = require('shelljs');
    if (channel == 'all') {
        console.log('打所有渠道');
        shell.exec('./packageall.sh');
    } else {
        console.log('需要打包渠道:' + channel);
        shell.exec('./packagesingle.sh ' + dir + channel, function (code, output) {
            console.log('code = ' + code);

            console.log(output);
        });
    }


});
