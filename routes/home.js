/**
 * Created by Ankit Verma on 11/9/17.
 */

'use strict';

// const express = require('express');
const router = require('express-promise-router')();

/* GET home page. */
router.get('/', (req, res) => {
    res
        .status(200)
        .json({
            success: false,
            error: true,
            message: 'Nothing to see here',
        });
});

module.exports = router;
