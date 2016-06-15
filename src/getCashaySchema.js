require('babel-register');
require('babel-polyfill');
const {transformSchema} = require('cashay');
const graphql = require('graphql').graphql;
const rootSchema = require('./schema');
module.exports = transformSchema(rootSchema, graphql);
