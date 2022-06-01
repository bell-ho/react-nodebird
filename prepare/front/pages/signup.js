import React, { useCallback, useState } from 'react';
import AppLayout from '../components/AppLayout';
import Head from 'next/head';
import { Button, Checkbox, Form, Input } from 'antd';
import useInput from '~/hook/useInput';
import styled from 'styled-components';
import { SIGN_UP_REQUEST } from '~/reducers/user';
import { useDispatch, useSelector } from 'react-redux';

const SignUp = () => {
  const ErrorMessage = styled.div`
    color: red;
  `;

  const dispatch = useDispatch();
  const { signUpLoading } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [passwordError, setPasswordError] = useState(false);

  const [passwordCheck, setPasswordCheck] = useState('');
  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password],
  );

  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [password, passwordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원가입 | NodeBird</title>
      </Head>
      <Form onFinish={onSubmit}>
        <div>
          <label htmlFor="user-email">아이디</label>
          <br />
          <Input
            name="user-email"
            value={email}
            required
            type="email"
            onChange={onChangeEmail}
          />
        </div>
        <div>
          <label htmlFor="user-nickname">닉네임</label>
          <br />
          <Input
            name="user-nickname"
            value={nickname}
            required
            onChange={onChangeNickname}
          />
        </div>
        <div>
          <label htmlFor="user-password">비밀번호</label>
          <br />
          <Input
            name="user-password"
            value={password}
            type="password"
            required
            onChange={onChangePassword}
          />
        </div>
        <div>
          <label htmlFor="user-password-check">비밀번호채크</label>
          <br />
          <Input
            name="user-password-check"
            type="password"
            value={passwordCheck}
            required
            onChange={onChangePasswordCheck}
          />
          {passwordError && (
            <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
          )}
        </div>
        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            동의합니다.
          </Checkbox>
          {termError && <ErrorMessage>동의를 확인하십시오.</ErrorMessage>}
        </div>
        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>
            가입하기
          </Button>
        </div>
      </Form>
    </AppLayout>
  );
};

export default SignUp;
