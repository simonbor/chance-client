'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  app: {
    server: {
      url: "http://localhost:8080/"
    },
  },
  SERVER_URL: "http://localhost:8080/",
  NODE_ENV: '"development"'
})
