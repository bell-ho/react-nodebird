import React, { useCallback, useState } from 'react';
import { Avatar, Button, Card, Comment, List, Popover } from 'antd';
import {
  EllipsisOutlined,
  HeartOutlined,
  HeartTwoTone,
  MessageOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PostImages from '~/components/PostImages';
import CommentForm from '~/components/CommentForm';
import PostCardContent from '~/components/PostCardContent';
import { REMOVE_POST_REQUEST } from '~/reducers/post';
import FollowButton from '~/components/FollowButton';

FollowButton.propTypes = {};
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [linked, setLinked] = useState(false);
  const [commentFormOpen, setCommentFormOpen] = useState(false);

  const { removePostLoading } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);

  const onToggleLike = useCallback(() => {
    setLinked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpen((prev) => !prev);
  }, []);
  const id = me?.id;

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.images[0] && <PostImages images={post.images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          linked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              onClick={onToggleLike}
              key="heart"
            />
          ) : (
            <HeartOutlined onClick={onToggleLike} key="heart" />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.user.id === id ? (
                  <>
                    <Button>수정</Button>
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
        extra={me?.id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.user.nickname[0]}</Avatar>}
          title={post.user.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpen && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.user.nickname}
                  avatar={<Avatar>{item.user.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.object,
    content: PropTypes.string,
    createAt: PropTypes.object,
    comments: PropTypes.arrayOf(PropTypes.object),
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
