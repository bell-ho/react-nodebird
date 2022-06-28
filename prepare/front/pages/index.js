import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '~/components/PostForm';
import PostCard from '~/components/PostCard';
import { LOAD_POSTS_REQUEST } from '~/reducers/post';
import { LOAD_MY_INFO_REQUEST } from '~/reducers/user';
import wrapper from '~/store/configureStore';
import { END } from 'redux-saga';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state) => state.post);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({ type: LOAD_POSTS_REQUEST, lastId });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

  // console.log(mainPosts);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post, i) => (
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
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POSTS_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  },
);

export default Home;
