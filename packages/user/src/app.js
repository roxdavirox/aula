const app = require('@badmuts/aula-base-server')
const amqp = require('@badmuts/aula-amqp')
const AmqpRouter = amqp.Router('user-service')
const isAuthenticated = require('express-jwt')({
    secret: require('./config/jwt').accessToken.publicKey
})

const UserHttpController = require('./controllers/user/HttpController')
const UserAmqpController = require('./controllers/user/AmqpController')
const UserRpcController = require('./controllers/user/RpcController')

app.get('/healthz', (req, res, next) => {
    res.json({
        version: require('../package.json').version,
        healthy: true
    })
})

app.post('/users', UserHttpController.create)
app.get('/users', isAuthenticated, UserHttpController.find)
app.get('/users/:id', isAuthenticated, UserHttpController.findOne)
app.put('/users/:id', isAuthenticated, UserHttpController.update)
app.delete('/users/:id', isAuthenticated, UserHttpController.destroy)

AmqpRouter.command('user.create', UserAmqpController.create)
AmqpRouter.rpc('user.findByEmail', UserRpcController.findByEmail)
AmqpRouter.rpc('user.findOne', UserRpcController.findOne)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
    err.status = err.status || 500

    if (process.env.NODE_ENV !== 'test')
        console.error('ERROR:', err)

    res.status(err.status);
    res.json({
        status: (err.status > 300 && err.status < 500) ? 'fail' : 'error',
        message: err.message,
        code: err.code || '',
        stack: (process.env.NODE_ENV === 'development') ? err.stack : {},
    });
});

module.exports = app
