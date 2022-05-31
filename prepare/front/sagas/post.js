import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_REQUEST,
} from '~/reducers/post';

function addPostAPI() {
  // return axios.post('/api~');
}

function* addPost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: 'ADD_POST_SUCCESS',
      // data: result.data,
    });
  } catch (e) {
    yield put({
      type: 'ADD_POST_FAILURE',
      data: e.response.data,
    });
  }
}

function addCommentAPI() {
  // return axios.post('/api~');
}

function* addComment(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      // data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: e.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchCommentPost() {
  yield takeLatest(ADD_COMMENT_REQUEST, addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost), fork(watchCommentPost)]);
}
