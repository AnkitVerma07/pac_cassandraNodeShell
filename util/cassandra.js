'use strict';
const config = require('../config/config');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client(config.get('cassandra'));

module.exports = client;