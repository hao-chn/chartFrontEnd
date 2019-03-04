'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_BASEURL:'"http://mstaz.ga:8014"'
    // API_BASEURL:'"http://192.168.1.63:8014/"'
});
