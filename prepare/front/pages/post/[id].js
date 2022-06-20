// post/[id].js
import React from 'react';
import { useRouter } from 'next/router';
import wrapper from '~/store/configureStore';
import axios from 'axios';
import { LOAD_MY_INFO_REQUEST } from '~/reducers/user';
import { LOAD_POST_REQUEST, LOAD_POSTS_REQUEST } from '~/reducers/post';
import { END } from 'redux-saga';
import AppLayout from '~/components/AppLayout';
import PostCard from '~/components/PostCard';
import { useSelector } from 'react-redux';
import Head from 'next/head';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singlePost } = useSelector((state) => state.post);

  // if (router.isFallback && !singlePost) {
  //   return <div>loading...</div>;
  // }

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta
          //og가 붙으면 공유했을때 미리보기가 뜸
          property="og:title"
          content={`${singlePost.User.nickname}님의 게시글`}
        />
        <meta property="og:description" content={singlePost.content} />
        <meta
          property="og:image"
          content={
            singlePost.Images[0]
              ? singlePost.Images[0].src
              : 'http://localhost:3000/favicon.ico'
          }
        />
        <meta property="og:url" content={`http://localhost:3000/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  );
};

//미리 만들어놔야 할 것들 불러오기
// export async function getStaticPaths() {
//   // 제한을 둬야함 (할만한 것들만)
//   return {
//     paths: [
//       { params: { id: '93' } },
//       { params: { id: '94' } },
//       { params: { id: '95' } },
//     ],
//     fallback: true,
//   };
// }
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.params.id,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Post;
