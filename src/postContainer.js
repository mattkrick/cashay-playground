import React, {Component} from 'react';
import LatestPost from './LatestPost';
import RecentPosts from './RecentPosts';
// import {iMap as Map, iList as List, fromJS} from 'immutable';

// window.iMap = iMap;
// window.iList = iList;
// window.initialState = fromJS({
//   data: {
//     entities: {},
//     result: {}
//   }
// });

export default class PostContainer extends Component {
  render() {
    return (
      <div>
        <RecentPosts/>
      </div>
    );
        // <LatestPost componentId="latestPost1"/>
        // <LatestPost componentId="latestPost2"/>
  }
}
