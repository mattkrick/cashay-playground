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
import {parse} from 'graphql/language/parser';
const rootReducer = combineReducers({
  cashay: cashayReducer
});

const devtoolsExt = global.devToolsExtension && global.devToolsExtension();
const store = createStore(rootReducer, {}, compose(
  devtoolsExt || (f => f)
));

export const cashay = new Cashay({
  store,
  schema: clientSchema,
  idFieldName: '_id',
  paginationWords: {before: 'beforeCursor', after: 'afterCursor'},
  transport(query, variables) {
    return graphql(gqlSchema, query, null, variables);
  },
});

render(
  <Provider store={store}>
    <CashayBook />
  </Provider>
  , document.getElementById('root')
);

const mut1 = `mutation($postId: String!, $content: String!) {
      newComment: createComment(postId: $postId, content: $content) {
        _id,
        content,
        karma,
        createdAt
      }
    }`;
const mut2 = `mutation($postId: String!, $content: String!) {
      newComment: createComment(postId: $postId, content: $content) {
        _id,
        content,
        createdAt
      }
    }`;

const mutmut = `
mutation($postId: String!, $id: String!, $content: String!) {
    createComment(postId: $postId, _id: $id, content: $content) {
      _id
    }
  }`
// console.log(parse(mutmut, {noLocation: true, noSource: true}));
// render(<App />, document.getElementById('root'));
//

const addCommentMutation = `
  mutation($postId: String!, $content: String!) {
    newComment: createComment(postId: $postId, content: $content) {
      _id,
      content,
      karma
    }
  }`;

const queryCommentsForPostId = `
  query($postId: String!) {
    comments: getCommentsByPostId(postId: $postId) {
      _id,
      content,
      karma,
      createdAt,
      postId
      
    }
  }`;

const mut3 = `
mutation ($foo: [newPost]) {
  createPost(newPost: {_id: "129", author: "a123", content: "Hii", title:"Sao", category:"hot stuff"}, foo: [newPost]) {
    post {
      ...{
        _id
      }
      ...spreadLevel1
    }
  }
}
fragment spreadLevel1 on PostType {
  	... {
      category
      ...spreadLevel2
    }
}
fragment spreadLevel2 on PostType {
  title(language:"spanish")
}`
// console.log('mutation', parse(mut3,{noLocation: true, noSource: true}));
// console.log('query', parse(queryCommentsForPostId,{noLocation: true, noSource: true}));
