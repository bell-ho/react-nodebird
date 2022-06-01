import React from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import NicknameEditForm from '~/components/NicknameEditForm';
import FollowList from '~/components/FollowList';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { me } = useSelector((state) => state.user);

  return (
    <>
      <Head>
        <title>내 프로필</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me.followings} />
        <FollowList header="팔로워 목록" data={me.followers} />
      </AppLayout>
    </>
  );
};

export default Profile;
