import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_COMMENT_REQUEST, addComment } from '~/reducers/post';
import useInput from '../hook/useInput';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { addCommentDone, addCommentError } = useSelector(
    (state) => state.post,
  );
  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText('');
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: me?.id },
    });
  }, [commentText, me?.id]);

  useEffect(() => {
    if (addCommentError) {
      alert('도배 방지');
    }
  }, [addCommentError]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.Group compact>
          <Input
            showCount
            value={commentText}
            maxLength={50}
            onChange={onChangeCommentText}
            style={{
              width: 'calc(100% - 59px)',
            }}
          />
          <Button htmlType="submit" type="primary">
            등록
          </Button>
        </Input.Group>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
