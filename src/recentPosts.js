import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from './index';
import SinglePost from './SinglePost';

const queryRecentPosts = `
  query($count: Int) {
    recentPosts: getRecentPosts(first: $count) {
      _id,
      title,
      cursor
    }
  }`;

const mapStateToProps = (state, props) => {
  return {
    cashay: cashay.query(queryRecentPosts, {variables: {count: 2}})
  }
};

@connect(mapStateToProps)
export default class RecentPosts extends Component {
  render() {
    const {recentPosts} = this.props.cashay.data;
    console.log(recentPosts)
    return (
      <div>
        <h2>RECENT POSTS</h2>
        <div>{recentPosts.map(post => <SinglePost key={`post${post._id}`} post={post}/>)}</div>
        {recentPosts.EOF ? null :
          <button onClick={() => this.get2More()}>Get 2 More</button>
        }
      </div>
    );
  }

  get2More() {
    const {setVariables} = this.props.cashay;
    setVariables(currentVariables => {
      return {
        count: currentVariables.count + 2
      }
    })
  }
}
