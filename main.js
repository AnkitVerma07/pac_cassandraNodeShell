'use strict';
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const jayson = require('jayson/promise');
const cors = require('cors');
const Promise = require('bluebird');
const hbs = require('hbs');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const YAML = require('js-yaml');
const resolve = require('json-refs').resolveRefs;

const oauth2 = require('./oauth/oauth2');

const home = require('./routes/home');

const app = express();
const IoC = require('./IoC');
const ioc = new IoC(app);
ioc.configure();

// view engine setup
hbs.registerPartials('./views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


const methods = {
    math: {
        add: function (args) {
            return Promise.resolve({sum: args.x + args.y});
        }
    },
    users: ioc.get('rpcUserRouter')
};

function flattenObject(ob) {
    let toReturn = {};
    Object.keys(ob).forEach(function (key) {
        if ((typeof ob[key]) === 'object') {
            let flatObject = flattenObject(ob[key]);
            Object.keys(flatObject).forEach(function (x) {
                toReturn[key + '.' + x] = flatObject[x];
            });
        } else if ((typeof ob[key]) === 'function') {
            toReturn[key] = ob[key];
        }
    });
    return toReturn;
}

const flatten = flattenObject(methods);
const server = jayson.server(flatten, {collect: true, params: Object});

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());

const swaggerDocument = YAML.safeLoad(fs.readFileSync('./swagger.yaml'));
const options = {
    filter: ['relative', 'remote'],
    loaderOptions: {
        processContent: (content, cb) => {
            cb(null, YAML.safeLoad(content.text));
        },
    },
};

const results = resolve(swaggerDocument, options);
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(results.resolved));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport configuration
ioc.get('auth');


const consistentResponseMiddleware = ioc.get('consistentResponseMiddleware').middleware;
app.use('/mh-api/*', bodyParser.urlencoded({extended: true}), bodyParser.json({
    verify: function (req, res, buf) {
        req.rawBody = buf
    }
}), consistentResponseMiddleware);


app.use(function (req, res, next) {
    console.log('\x1b[33m%s\x1b[0m', req.body.method);
    //console.log(req.body);
    next();
});

const corsOptions = {
    origin: [/localhost.*/, /ec2.*/, /amazonaws.*/],
    credentials: true,
};


app.use(cors(corsOptions));
app.post('/oauth/token', ioc.get('oauth2').token);
app.use('/', home);
app.use('/rpc', server.middleware());
app.use('/pac/users', ioc.get('usersRouter').router);
app.use('/pac/oauth-clients', ioc.get('oauthClientRouter').router);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler

// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// development error handler
// will print stacktrace
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500)
        .json({
            message: err.message,
            error: err
        });
});

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500)
        .json({
            message: err.message,
            error: {}
        });
});

module.exports = app;
