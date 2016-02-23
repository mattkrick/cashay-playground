const queryString = `
query getPosts($language: String) {
  recentPosts(count: 2) {
    id: _id,
    title (language: $language),
    author {
      ...getAuthor
    },
    comments {
      id: _id,
      content,
      replies {
        id: _id,
        content
      }
    }
  }
}

fragment getAuthor on Author {
	_id
  name
  twitterHandle
}`;

const variableValues = {
  language: ''
};

const response = {
  "data": {
    "recentPosts": [
      {
        "id": "03390abb5570ce03ae524397d215713b",
        "title": "New Feature: Tracking Error Status with Kadira",
        "author": {
          "_id": "pahan",
          "name": "Pahan Sarathchandra",
          "twitterHandle": "@pahans"
        },
        "comments": [
          {
            "id": "cid-95818779",
            "content": "This is a very good blog post",
            "replies": [
              {
                "id": "cid-38230660",
                "content": "Thank You!"
              },
              {
                "id": "cid-1092189",
                "content": "If you need more information, just contact me."
              }
            ]
          },
          {
            "id": "cid-54002462",
            "content": "Keep up the good work",
            "replies": [
              {
                "id": "cid-38230660",
                "content": "Thank You!"
              },
              {
                "id": "cid-1092189",
                "content": "If you need more information, just contact me."
              }
            ]
          }
        ]
      },
      {
        "id": "2f6b59fd0b182dc6e2f0051696c70d70",
        "title": "Understanding Mean, Histogram and Percentiles",
        "author": {
          "_id": "arunoda",
          "name": "Arunoda Susiripala",
          "twitterHandle": "@arunoda"
        },
        "comments": [
          {
            "id": "cid-95818779",
            "content": "This is a very good blog post",
            "replies": [
              {
                "id": "cid-38230660",
                "content": "Thank You!"
              },
              {
                "id": "cid-1092189",
                "content": "If you need more information, just contact me."
              }
            ]
          },
          {
            "id": "cid-54002462",
            "content": "Keep up the good work",
            "replies": [
              {
                "id": "cid-38230660",
                "content": "Thank You!"
              },
              {
                "id": "cid-1092189",
                "content": "If you need more information, just contact me."
              }
            ]
          }
        ]
      }
    ]
  }
};

const combos = {
  result: {
    noArgsReturnsScalar: 'foo',
    noArgsReturnsObject: '0',
    noArgsReturnsList: ['0', '1', '2'],
    regArgsReturnsScalar: {
      "{published: true}": 'foo'
    },
    regArgsReturnsObject: {
      "{published: true}": '0'
    },
    regArgsReturnsList: {
      "{published: true}": ['0', '1', '2']
    },
    firstNoAfterReturnsList: {
      front: ['1', '2']
    },
    firstAndAfterReturnsList: {
      front: ['1', '2'],
      after: '0'
    },
    lastNoBeforeReturnsList: {
      back: ['1', '0']
    },
    lastAndBeforeReturnsList: {
      back: ['1', '0'],
      before: '2'
    },
    noSuppliedPageArgsReturnsList: {
      full : ['0','1','2']
    },
    regArgsFirstNoAfterReturnsList: {
      "{published: true}": {
        front: ['1', '2']
      }
    },
    regArgsFirstAndAfterReturnsList: {
      "{published: true}": {
        front: ['1', '2'],
        after: '0'
      },
    },
    regArgsLastNoBeforeReturnsList: {
      "{published: true}": {
        back: ['1', '0']
      }
    },
    regArgsLastAndBeforeReturnsList: {
      "{published: true}": {
        back: ['1', '0'],
        before: '2'
      }
    },
    allArgsReturnsList: {
      "{published: true}": ['0', '1', '2']
    },
    allPosts: { // args accepted: published
      "": ['0', '1', '2'], // no args given
      "{published: true}": ['0'],
      "{published: false}": ['1', '2']
    },
    allPostsPaginated: {
      "": {
        front: ['0', '1', '2']
      }
    }
    ,
    allPostsNoArgs: ['0', '1', '2'],
    firstPost: '0',
    specificPost: {
      "{postId: '0'}": '0'
    }
  }
}
