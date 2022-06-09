import {
  all,
  delay,
  fork,
  put,
  takeLatest,
  call,
  throttle,
} from 'redux-saga/effects';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POSTS_REQUEST,
  LOAD_POSTS_SUCCESS,
  LOAD_POSTS_FAILURE,
  generateDummyPost,
} from '~/reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '~/reducers/user';
import shortId from 'shortId';
import axios from 'axios';

function loadPostsAPI() {
  // return axios.post('/api~');
}

function* loadPosts(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: LOAD_POSTS_SUCCESS,
      data: generateDummyPost(10),
    });
  } catch (e) {
    yield put({
      type: LOAD_POSTS_FAILURE,
      error: e.response.data,
    });
  }
}

function addPostAPI(data) {
  return axios.post('/posts', { content: data });
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({ type: ADD_POST_TO_ME, data: result.data.id });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      error: e.response.data,
    });
  }
}

function removePostAPI() {
  // return axios.post('/api~');
}

function* removePost(action) {
  try {
    // const result = yield call(addPostAPI, action.data);
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({ type: REMOVE_POST_OF_ME, data: action.data });
  } catch (e) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: e.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/posts/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: e.response.data,
    });
  }
}

function* watchLoadPosts() {
  yield throttle(5000, LOAD_POSTS_REQUEST, loadPosts);
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchCommentPost() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchAddPost),
    fork(watchRemovePost),
    fork(watchCommentPost),
  ]);
}
