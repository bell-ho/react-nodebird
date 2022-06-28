import React, { useCallback, useEffect, useRef } from 'react';
import { Button, Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  ADD_POST_REQUEST,
  LOAD_POSTS_REQUEST,
  REMOVE_IMAGE,
  UPLOAD_IMAGES_REQUEST,
} from '~/reducers/post';
import useInput from '~/hook/useInput';

const PostForm = () => {
  const dispatch = useDispatch();
  const { imagePaths, addPostDone, addPostLoading, addPostError } = useSelector(
    (state) => state.post,
  );
  const [text, onChangeText, setText] = useInput('');

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요');
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);
    return dispatch({ type: ADD_POST_REQUEST, data: formData });
  }, [text, imagePaths]);

  useEffect(() => {
    if (addPostDone) {
      setText('');
    }
  }, [addPostDone]);

  useEffect(() => {
    //도배 방지
    if (addPostError) {
      alert(addPostError);
    }
  }, [addPostError]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current?.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    const reg = /(.*?)\.(jpg|jpeg|png|gif|bmp)$/;
    [].forEach.call(e.target.files, (f) => {
      if (f.name.match(reg)) {
        imageFormData.append('image', f);
      }
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({ type: REMOVE_IMAGE, data: index });
    },
    [],
  );

  return (
    <Form
      style={{ margin: '10px 0 20px' }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        // showCount
        maxLength={140}
        placeholder="입력"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          accept="image/*"
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button
          type="primary"
          style={{ float: 'right' }}
          loading={addPostLoading}
          htmlType="submit"
        >
          등록
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={v.replace(/\/thumb\//, '/original/')}
              style={{ width: '200px' }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
