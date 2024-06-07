exports.createApp = (port) => {
    const compression = require('compression');
    const cookieParser = require('cookie-parser');
    const cookieSession = require('cookie-session');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const errorHandler = require('errorhandler');
    const express = require('express');
    const fileUpload = require('express-fileupload');

    dotenv.config({path: __dirname + '/.env'});

    const app = express();
    app.use(cors('*'));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(compression());
    app.use(cookieParser());
    app.use(fileUpload());
    app.use(cookieSession({name: 'session', keys: ['roostercookie'], maxAge: 24 * 60 * 60 * 1000}));
    app.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, authorization');
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        next();
    });

    if(app.get('env') === 'development')
        app.use(errorHandler({dumpException: true, showStack: true}));
    else
        app.use(errorHandler());

    app.set('port', port);

    return app;
}