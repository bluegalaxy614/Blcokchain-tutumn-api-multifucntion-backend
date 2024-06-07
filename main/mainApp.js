exports.createApp = (port, db) => {
    const express = require('express');
    const path = require('path');
    const models = require('../models/index');
    const tatumController = require('./controllers/tatumController');

    const app = require('../lib/app').createApp(port);
    
    app.use(express.static('client'));
    app.use('/', require('./middleware/index'), require('./routes/index'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'client', 'index.html')
        );
    });

    models.mongoose.connect(db)
        .then(() => {
            console.log('server connected to mongodb successfully.');
            tatumController.initTatumETH();
        })
        .catch((err) => {
            console.error({title: 'mongodb connection error', message: err.message});
            process.exit();
        });

    return app;
}