import React, { useCallback } from 'react';
import { Avatar, Button, Card } from 'antd';

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          쨱짹 <br />0
        </div>,
        <div key="followings">
          팔로잉 <br />0
        </div>,
        <div key="followings">
          팔로잉 <br />0
        </div>,
      ]}
    >
      <Card.Meta title="bell-ho" avatar={<Avatar>JH</Avatar>} />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  );
};

export default UserProfile;
