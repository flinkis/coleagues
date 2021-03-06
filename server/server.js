/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/
import express from 'express';

const app = express();
const path = require('path');

// Serve application file depending on environment
app.get('/app.js', (req, res) => {
    if (process.env.PRODUCTION) {
        res.sendFile(path.join(__dirname, '../build', 'app.js'));
    } else {
        res.redirect('//localhost:9090/build/app.js');
    }
});

// Serve aggregate stylesheet depending on environment
app.get('/main.css', (req, res) => {
    if (process.env.PRODUCTION) {
        res.sendFile(path.join(__dirname, '../build', 'main.css'));
    } else {
        res.redirect('//localhost:9090/build/main.css');
    }
});

// Serve index page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('../webpack.local.config');

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        noInfo: true,
        headers: { 
            "Access-Control-Allow-Origin": "*" 
        },
        historyApiFallback: true
    }).listen(9090, 'localhost', (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}

/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});


/*************************************************************
 *
 * Setup Socket.io
 *
 * See: https://socket.io/
 *
 *************************************************************/
import socket from './socket';

const io = require('socket.io')(server);
io.sockets.on('connection', socket);

