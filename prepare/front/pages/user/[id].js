import React, { useEffect } from 'react';
import AppLayout from '~/components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '~/components/PostCard';
import { LOAD_USER_POSTS_REQUEST } from '~/reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '~/reducers/user';
import wrapper from '~/store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Avatar, Card } from 'antd';
import Head from 'next/head';

const User = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const { id } = router.query;

  const { userInfo } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({ type: LOAD_USER_POSTS_REQUEST, lastId: lastId, data: id });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts, id]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
          <meta
            name="description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:title"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:description"
            content={`${userInfo.nickname}님의 게시글`}
          />
          <meta
            property="og:image"
            content="http://localhost:3000/favicon.ico"
          />
          <meta
            property="og:url"
            content={`http://localhost:3000/user/${id}`}
          />
        </Head>
      )}
      {userInfo ? (
        <Card
          style={{ marginBottom: 20 }}
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
          />
        </Card>
      ) : null}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

// 온전히 프론트 서버에서 실행됨
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    //context 안에 store가 있음

    const cookie = context.req ? context.req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';

    //다른 사람과 쿠키 공유 문제 해결
    if (context.req && cookie) {
      // 프론트 서버일때와 쿠키가 있을때만 쿠키를 넣는다
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_USER_POSTS_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch({
      type: LOAD_USER_REQUEST,
      data: context.params.id,
    });

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default User;
