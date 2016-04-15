import React, {Component} from 'react';
import {connect} from 'react-redux';
import {cashay} from './index';


const queryLatestPost = `
  query {
    latestPost {
      _id,
      title
    }
  }`;

const mapStateToProps = (state, props) => {
  return {
    cashay: cashay.query(queryLatestPost, {
      idFieldName: '_id',
      componentId: props.componentId
    })
  }
}

@connect(mapStateToProps)
export default class LatestPost extends Component {
  render() {
    const {data: {latestPost}, setVariables} = this.props.cashay;
    return (
      <div>
        <div>{this.renderPost(latestPost)}</div>
        <button onClick={this.get5More}>"Get 5 More"</button>
      </div>
    );
  }

  get5More() {
    const {setVariables} = this.props.cashay;
    setVariables(currentVariables => {
      return {
        count: currentVariables.count + 5
      }
    })
  }

  renderPost(post) {
    return (
      <div key={`post${post._id}`}>
        <div>Post id: {post._id}</div>
        <div>Post title: {post.title}</div>
        <br/>
      </div>
    )
  }
}
