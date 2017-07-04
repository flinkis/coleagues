import _ from 'lodash';
import jwt from 'json-web-token';

const Auth = {
    secret: 'TOPSECRETTTTT',

    login(data, user, socket, callback) {
        socket.emit('user:trylogin', data, (result) => {
            if (!result) {
                return alert('There was an error at login');
            }

            const { loggedInUser } = result;

            if (loggedInUser) {
                socket.emit('user:update', { user, newUser: loggedInUser });

                this.encodeData(loggedInUser);

                if (_.isFunction(callback)) {
                    callback(loggedInUser);
                }
            } else {
                console.error('loggedInUser not found');
            }
        });
    },

    signup(data, socket, callback) {
        socket.emit('user:signup', data, (response) => {
            if (response) {
                this.encodeData(response);
            }

            if (_.isFunction(callback)) {
                callback(response);
            }
        });
    },

    handleAuthentication(socket, callback) {
        if (this.isAuthenticated()) {
            const token = localStorage.getItem('access_token');

            socket
                .emit('authenticate', { token })
                .on('authenticated', () => {
                    this.decodeData(token, callback);
                })
                .on('unauthorized', (msg) => {
                    console.error(`unauthorized: ${JSON.stringify(msg.description)}`);
                });
        } else if (_.isFunction(callback)) {
            callback(false);
        }
    },

    encodeData(data) {
        jwt.encode(this.secret, data, (err, accessToken) => {
            if (err) {
                console.error(err.name, err.message);
            } else {
                this.setSession({
                    accessToken,
                    expiresAt: 4,
                });
            }
        });
    },

    setSession(authResult) {
        if (authResult && authResult.accessToken) {
            const expiresAt = Date.now() + (4 * 60 * 60 * 1000);

            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('expires_at', expiresAt);
        }
    },

    decodeData(token, callback) {
        jwt.decode(this.secret, token, (err, decodedPayload) => {
            if (err) {
                console.error(err.name, err.message);
            } else if (_.isFunction(callback)) {
                callback(decodedPayload);
            }
        });
    },


    logout(socket, user, callback) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');

        socket.emit('user:logout', user);

        if (_.isFunction(callback)) {
            callback();
        }
    },

    isAuthenticated() {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));

        return new Date().getTime() < expiresAt;
    },
};

export default Auth;
