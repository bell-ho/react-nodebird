import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_COMMENT_REQUEST, addComment } from '~/reducers/post';
import useInput from '../hook/useInput';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { addCommentDone, addCommentLoading } = useSelector(
    (state) => state.post,
  );
  const [loading, setLoading] = useState(false);
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (!loading) {
      setCommentText('');
    }
  }, [loading]);

  const onSubmitComment = useCallback(() => {
    setLoading(true);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: me?.id },
    });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [commentText, me?.id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
        <Button
          type="primary"
          htmlType="submit"
          style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
          loading={loading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
