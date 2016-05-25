import React, {Component} from 'react';
import RecentPosts from './RecentPosts';

export default class CashayBook extends Component {
  render() {
    return (
      <div className="postContainer">
        <div className="recentPosts">
          <h1>Welcome to the Cashay book!</h1>
          <RecentPosts/>
        </div>
      </div>
    );
  }
}
