import React from 'react';
import {render} from 'react-dom';
import App from './App';
import CashayBook from './CashayBook';
import {createStore, compose, combineReducers} from 'redux'
import {Provider} from 'react-redux';
import {cashay, cashayReducer, HTTPTransport} from 'cashay';
import gqlSchema from './schema.js';
const clientSchema = require('cashay!./getCashaySchema.js');
import {graphql} from 'graphql';

const rootReducer = combineReducers({
  cashay: cashayReducer
});

const transport = new HTTPTransport('/graphql');

const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
const store = createStore(rootReducer, {}, compose(
  devtoolsExt || (f => f)
));

cashay.create({
  store,
  schema: clientSchema,
  idFieldName: '_id',
  paginationWords: {before: 'beforeCursor', after: 'afterCursor'},
  transport
});

render(
  <Provider store={store}>
    <CashayBook />
  </Provider>
  , document.getElementById('root')
);

// use this for graphiql
// render(<App />, document.getElementById('root'));
