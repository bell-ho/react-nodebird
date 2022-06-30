import React, { useCallback } from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { useRouter } from 'next/router';
import { backUrl } from '~/config/config';
import { Tooltip } from 'antd';

const GoogleLoginBtn = () => {
  const router = useRouter();
  const onClickGoogleLogin = useCallback(() => {
    router.push(`${backUrl}/user/auth/google`);
  }, []);
  return (
    <Tooltip placement="bottom" title="로그인">
      <GoogleLoginButton
        onClick={onClickGoogleLogin}
        align="center"
        size="40px"
        text="Google Login"
        style={{ width: '200px' }}
      />
    </Tooltip>
  );
};

export default GoogleLoginBtn;
