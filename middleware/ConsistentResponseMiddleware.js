/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';


const Middleware = () => {

    return {
        middleware: (req, res, next) => {
            req.success = (resultObj) => {
                const response = {
                    success: true,
                    error: false,
                    result: resultObj,
                };

                res.json(response);
            };

            req.fail = (msg, isError) => {
                const response = {
                    success: false,
                    error: true,
                    message: msg,
                };

                res.json(response);
            };

            res.success = (resultObj) => {
                const response = {
                    success: true,
                    error: false,
                    result: resultObj,
                };

                res.json(response);
            };

            res.fail = (msg, isError) => {
                const response = {
                    success: false,
                    error: true,
                    message: msg,
                };

                res.json(response);
            };

            next();
        },
    };
};

module.exports = Middleware;