import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';

function addPostAPI() {
  // return axios.post('/api~');
}

function* addPost(action) {
  try {
    yield delay(1000);

    // const result = yield call(addPostAPI, action.data);
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

function* watchAddPost() {
  yield takeLatest('ADD_POST_REQUEST', addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
