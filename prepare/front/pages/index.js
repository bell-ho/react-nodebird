import React, { useCallback, useEffect } from 'react';
import AppLayout from '../components/AppLayout';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '~/components/PostForm';
import PostCard from '~/components/PostCard';
import {
  WindowScroller,
  CellMeasurer,
  CellMeasurerCache,
  AutoSizer,
  List,
  ListRowProps,
} from 'react-virtualized';
import { LOAD_POSTS_REQUEST } from '~/reducers/post';

const cache = new CellMeasurerCache({
  defaultWidth: 100,
  fixedWidth: true,
});
const Home = () => {
  const dispatch = useDispatch();

  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostsLoading } = useSelector(
    (state) => state.post,
  );

  useEffect(() => {
    dispatch({ type: LOAD_POSTS_REQUEST });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostsLoading) {
          dispatch({ type: LOAD_POSTS_REQUEST });
        }
      }
    }

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePost, loadPostsLoading]);

  const rowRenderer = useCallback(
    ({ index, key, parent, style }) => {
      return (
        <CellMeasurer
          cache={cache}
          parent={parent}
          key={key}
          columnIndex={0}
          rowIndex={index}
        >
          <PostCard
            key={mainPosts[index].id}
            post={mainPosts[index]}
            style={style}
          />
        </CellMeasurer>
      );
    },
    [mainPosts],
  );

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {/*<WindowScroller>*/}
      {/*  {({ height, scrollTop, isScrolling, onChildScroll }) => (*/}
      {/*    <AutoSizer disableHeight>*/}
      {/*      {({ width }) => (*/}
      {/*        <List*/}
      {/*          autoHeight*/}
      {/*          height={height}*/}
      {/*          width={width}*/}
      {/*          isScrolling={isScrolling}*/}
      {/*          overscanRowCount={0}*/}
      {/*          onScroll={onChildScroll}*/}
      {/*          scrollTop={scrollTop}*/}
      {/*          rowCount={mainPosts.length}*/}
      {/*          rowHeight={cache.rowHeight}*/}
      {/*          rowRenderer={rowRenderer}*/}
      {/*          deferredMeasurementCache={cache}*/}
      {/*        />*/}
      {/*      )}*/}
      {/*    </AutoSizer>*/}
      {/*  )}*/}
      {/*</WindowScroller>*/}
    </AppLayout>
  );
};

export default Home;
