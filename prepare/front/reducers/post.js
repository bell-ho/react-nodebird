export const initialState = {
  mainPosts: [
    {
      id: 1,
      user: {
        id: 1,
        nickname: 'dddd',
      },
      content: '첫 번째 글 #해시태그',
      images: [
        {
          src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        },
        {
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
        {
          src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        },
        {
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
        {
          src: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
        },
        {
          src: 'https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg',
        },
      ],
      comments: [
        {
          user: {
            nickname: '111',
          },
          content: '잘나오나',
        },
        {
          user: {
            nickname: '2',
          },
          content: '잘나오나3333',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: '222',
  user: {
    id: 1,
    nickname: '1111',
  },
  images: [],
  comments: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts], // 앞에다 추가해야 가장 앞에 보임
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
