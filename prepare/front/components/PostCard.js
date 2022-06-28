import React, { createElement, useCallback, useState } from 'react';
import { Avatar, Button, Card, Comment, List, Popover, Tooltip } from 'antd';
import {
  EllipsisOutlined,
  LikeOutlined,
  LikeTwoTone,
  MessageOutlined,
  RetweetOutlined,
  DislikeFilled,
  DislikeOutlined,
  LikeFilled,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from '~/components/PostImages';
import CommentForm from '~/components/CommentForm';
import PostCardContent from '~/components/PostCardContent';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  LIKE_POST_REQUEST,
  REMOVE_POST_REQUEST,
  RETWEET_REQUEST,
  UNLIKE_POST_REQUEST,
  UPDATE_POST_REQUEST,
} from '~/reducers/post';
import FollowButton from '~/components/FollowButton';
import Link from 'next/link';
import moment from 'moment';

moment.locale('ko');

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentFormOpen, setCommentFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { removePostLoading } = useSelector((state) => state.post);
  const id = useSelector((state) => state.user.me?.id);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({ type: LIKE_POST_REQUEST, data: post.id });
  }, [id, post.id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({ type: UNLIKE_POST_REQUEST, data: post.id });
  }, [id, post.id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpen((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id, post.id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({ type: RETWEET_REQUEST, data: post.id });
  }, [id]);

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);

  const onChangePost = useCallback(
    (editText) => () => {
      dispatch({
        type: UPDATE_POST_REQUEST,
        data: { PostId: post.id, content: editText },
      });
    },
    [post],
  );
  const linked = post.Likers?.find((v) => v.id === id);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState(null);

  const like = () => {
    setLikes(1);
    setDislikes(0);
    setAction('liked');
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction('disliked');
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post?.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          linked ? (
            <div onClick={onUnLike}>
              <LikeTwoTone key="heart" style={{ marginRight: 3 }} />
              {`${post.Likers.length}`}
            </div>
          ) : (
            <div onClick={onLike}>
              <LikeOutlined key="heart" style={{ marginRight: 3 }} />
              {`${post.Likers.length}`}
            </div>
          ),
          <div onClick={onToggleComment}>
            <MessageOutlined key="comment" style={{ marginRight: 3 }} />
            {`${post.Comments.length}`}
          </div>,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    {!post.RetweetId && (
                      <Button onClick={onClickUpdate}>수정</Button>
                    )}
                    <Button
                      type="danger"
                      loading={removePostLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗했습니다.` : null
        }
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <div style={{ float: 'right' }}>
              {moment(post.createdAt).startOf('m').fromNow()}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.Retweet.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={
                <PostCardContent
                  onChangePost={onChangePost}
                  onCancelUpdate={onCancelUpdate}
                  postData={post.Retweet.content}
                />
              }
            />
          </Card>
        ) : (
          <>
            <div style={{ float: 'right' }}>
              {moment(post.createdAt).startOf('m').fromNow()}
            </div>
            <Card.Meta
              avatar={
                <Link href={`/user/${post.User.id}`} prefetch={false}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={
                <>
                  <PostCardContent
                    editMode={editMode}
                    onChangePost={onChangePost}
                    onCancelUpdate={onCancelUpdate}
                    postData={post.content}
                  />
                </>
              }
            />
          </>
        )}
      </Card>
      {commentFormOpen && (
        <>
          <div
            id="scrollableDiv"
            style={{
              height: 200,
              overflow: 'auto',
              padding: '0 16px',
              border: '1px solid rgba(140, 140, 140, 0.35)',
            }}
          >
            <InfiniteScroll
              dataLength={post?.Comments.length}
              // next={loadMoreData}
              hasMore={post?.Comments.length < 10}
              // loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              scrollableTarget="scrollableDiv"
            >
              <List
                header={`${post.Comments.length}개의 댓글`}
                itemLayout="horizontal"
                dataSource={post?.Comments}
                renderItem={(item) => {
                  return (
                    <li>
                      <Comment
                        author={item?.User?.nickname}
                        avatar={
                          <Link href={`/user/${item.User.id}`} prefetch={false}>
                            <a>
                              <Avatar>{item?.User?.nickname[0]}</Avatar>
                            </a>
                          </Link>
                        }
                        content={item.content
                          .split(/(#[^\s#]+)/g)
                          .map((v, i) => {
                            if (v.match(/(#[^\s#]+)/g)) {
                              return (
                                <Link
                                  href={`/hashtag/${v.slice(1)}`}
                                  prefetch={false}
                                  key={i}
                                >
                                  <a>{v}</a>
                                </Link>
                              );
                            }
                            return v;
                          })}
                        datetime={
                          <Tooltip
                            title={moment().format('YYYY-MM-DD HH:mm:ss')}
                          >
                            <span>{moment(item.createdAt).fromNow()}</span>
                          </Tooltip>
                        }
                        actions={[
                          <Tooltip key="comment-basic-like" title="Like">
                            <span onClick={like}>
                              {createElement(
                                action === 'liked' ? LikeFilled : LikeOutlined,
                              )}
                              <span className="comment-action">{likes}</span>
                            </span>
                          </Tooltip>,
                          <Tooltip key="comment-basic-dislike" title="Dislike">
                            <span onClick={dislike}>
                              {React.createElement(
                                action === 'disliked'
                                  ? DislikeFilled
                                  : DislikeOutlined,
                              )}
                              <span className="comment-action">{dislikes}</span>
                            </span>
                          </Tooltip>,
                        ]}
                      />
                    </li>
                  );
                }}
              />
            </InfiniteScroll>
          </div>
          <CommentForm post={post} />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
