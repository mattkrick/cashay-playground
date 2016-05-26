import React from 'react';
import {render} from 'react-dom';
import App from './App';
import CashayBook from './CashayBook';
import {createStore, compose, combineReducers} from 'redux'
import {Provider} from 'react-redux';
import {} from 'redux';
import {Cashay, cashayReducer} from 'cashay';
import gqlSchema from './schema.js';
import clientSchema from 'cashay/src/__tests__/clientSchema.json';
import {graphql} from 'graphql';
const rootReducer = combineReducers({
  cashay: cashayReducer
});

const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
const store = createStore(rootReducer, {}, compose(
  devtoolsExt || (f => f)
));

const delay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const cashay = new Cashay({
  store,
  schema: clientSchema,
  idFieldName: '_id',
  paginationWords: {before: 'beforeCursor', after: 'afterCursor'},
  transport: (query, variables) => delay().then(() => graphql(gqlSchema, query, null, null, variables))
});

render(
  <Provider store={store}>
    <CashayBook />
  </Provider>
  , document.getElementById('root')
);

// use this for graphiql
// render(<App />, document.getElementById('root'));
