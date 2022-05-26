import React, { useCallback, useState, useMemo } from 'react';
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const LoginForm = ({ setIsLoggedIn }) => {
  // 이런식으로 스타일 가능
  // const style = useMemo(() => ({ marginTop: 10 }), []);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const onChangeId = useCallback((e) => {
    setId(e.target.value);
  }, []);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  });

  const onSubmitForm = useCallback(() => {
    console.log(id, password);
    setIsLoggedIn(true);
    // state는 넣어줘야함 변하는 것이여서 (빈 배열로 넣으면 마운트 시점에 id와 password가 없어서 같은걸로 쳐서 리랜더링이 안됨)
  }, [id, password]);

  const FormWrapper = styled(Form)`
    padding: 10px;
  `;

  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          value={password}
          onChange={onChangePassword}
          required
        />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={false}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};

export default LoginForm;
