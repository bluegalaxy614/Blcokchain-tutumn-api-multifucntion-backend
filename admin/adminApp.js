exports.createApp = (port, db) => {
    const express = require('express');
    const path = require('path');
    const models = require('../models/index');
    const adminController = require('./controllers/adminController');
    
    const app = require('../lib/app').createApp(port);
    
    app.use(express.static('admin/client/build'));
    app.use(express.static('client/build'));
    app.use('/', require('./middleware/index'), require('./routes/index'));

    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'client', 'build', 'index.html')
        );
    });

    models.mongoose.connect(db)
        .then(async () => {
            console.log('server connected to mongodb successfully.');
            adminController.addAdminUser();
        })
        .catch((err) => {
            console.error({title: 'mongodb connection error', message: err.message});
            process.exit();
        });

    return app;
}