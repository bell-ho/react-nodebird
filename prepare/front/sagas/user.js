import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
  LOG_IN_REQUEST,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
} from '~/reducers/user';

function logInAPI() {
  // return axios.post('/api~');
}

function* logIn(action) {
  try {
    yield delay(1000);
    // const result = yield call(logInAPI, action.data); //call 을 쓰면 인자를 펴서 줘야함
    yield put({
      type: 'LOG_IN_SUCCESS',
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: 'LOG_IN_FAILURE',
      data: e.response.data,
    });
  }
}

function logOutAPI() {
  // return axios.post('/api~');
}

function* logOut() {
  try {
    yield delay(1000);

    // const result = yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
      // data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: e.response.data,
    });
  }
}

function signUpAPI() {
  // return axios.post('/api~');
}

function* signUp() {
  try {
    // const result = yield call(logOutAPI);
    yield delay(1000);
    yield put({
      type: SIGN_UP_SUCCESS,
      // data: result.data,
    });
  } catch (e) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: e.response.data,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchSignUp)]);
}
