var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');
var secret = 'tinaisheretoday'; // key to decript and encript

var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = 'mongodb://localhost/store';

// route to authenticate a user (POST http://localhost:3000/authenticate)

router.post('/authenticate', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        var collection = db.collection('login');

        collection.findOne({
            name: req.body.name
        }, function(err, user) {
            if (!user) {
                res.status(304);
                res.json({
                    'msg': 'no user found'
                });
            } else {
                // is the password correct

                if (req.body.password != user.password) {

                } else {
                    // if everything is ok then create a token and give it to the user

                    var token = jwt.sign(user, secret);

                    res.json({
                        'msg': 'success',
                        'token': token
                    });
                }

                db.close();
            }
        });

    });
});

// route middleware to verify a token
router.use(function(req, res, next) {
    // check if user has a token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];


    jwt.verify(token, secret, function(err, decoded) {

        if (err) {

        	res.json({msg : 'user not allowed'});

        } else {
            req.decoded = decoded;
            console.log(decoded);
            next();
        }

    });

});

router.get('/', function(req, res) {
    res.json({
        message: 'Token was provided, Welcome to the coolest API on earth!',
        user: req.decoded
    });
});


module.exports = router;
