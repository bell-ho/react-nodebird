import React, { useCallback, useEffect } from 'react';
import { Button, Form, Input, Row } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '~/hook/useInput';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequestAction } from '~/reducers/user';
import GoogleLoginBtn from '~/components/GoogleLoginBtn';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  // 이런식으로 스타일 가능
  // const style = useMemo(() => ({ marginTop: 10 }), []);

  const { logInLoading, logInError } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({ email, password }));
  }, [email, password]); // state는 넣어줘야함 변하는 것이여서 (빈 배열로 넣으면 마운트 시점에 id와 password가 없어서 같은걸로 쳐서 리랜더링이 안됨)

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input
          type="email"
          name="user-email"
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          type="password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
      <Form.Item>
        <Row justify="center" wrap={false}>
          <GoogleLoginBtn />
        </Row>
      </Form.Item>
    </FormWrapper>
  );
};

export default LoginForm;
