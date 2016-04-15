import React from 'react';
import {render} from 'react-dom';
import App from './App';
// import ListPosts from './ListPosts';
import PostContainer from './PostContainer';
import {createStore, compose, combineReducers} from 'redux'
import {Provider} from 'react-redux';
import {} from 'redux';
import {Cashay, cashayReducer} from 'cashay';
import gqlSchema from './schema.js';
import clientSchema from './clientSchema.json';
import { graphql } from 'graphql';

const rootReducer = combineReducers({
  cashay: cashayReducer
});

const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
const store = createStore(rootReducer, {}, compose(
  // applyMiddleware(...middlewares),
  devtoolsExt || (f => f)
));

export const cashay = new Cashay({
  store,
  transport(query, variables) {
    return graphql(gqlSchema, query, null, variables);
  },
  schema: clientSchema
});

render(
  <Provider store={store}>
    <PostContainer />
  </Provider>
  , document.getElementById('root')
);
// render(<App />, document.getElementById('root'));
