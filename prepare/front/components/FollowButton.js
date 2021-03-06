import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '~/reducers/user';

const FollowButton = ({ post, key }) => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const { me, followLoading, unfollowLoading } = useSelector(
    (state) => state.user,
  );

  const isFollowing = me && me.Followings.find((v) => v.id === post.User.id);

  const onClickButton = useCallback(() => {
    setLoading(true);
    if (isFollowing) {
      dispatch({ type: UNFOLLOW_REQUEST, data: post.User.id });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      dispatch({ type: FOLLOW_REQUEST, data: post.User.id });
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [isFollowing]);

  //훅 보다는 아래에 작성해야함
  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button loading={loading} onClick={onClickButton}>
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
