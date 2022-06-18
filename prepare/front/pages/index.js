import React, { useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '~/components/PostForm';
import PostCard from '~/components/PostCard';
import { LOAD_POSTS_REQUEST } from '~/reducers/post';
import { LOAD_MY_INFO_REQUEST } from '~/reducers/user';
import wrapper from '~/store/configureStore';
import { END } from 'redux-saga';
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

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_MY_INFO_REQUEST,
  //   });
  //
  //   dispatch({ type: LOAD_POSTS_REQUEST });
  // }, []);

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

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    //context 안에 store가 있음
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
