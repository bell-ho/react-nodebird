import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button, Input } from 'antd';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({
  postData,
  editMode,
  onCancelUpdate,
  onChangePost,
}) => {
  const [editText, setEditText] = useState(postData);

  const { updatePostLoading, updatePostDone } = useSelector(
    (state) => state.post,
  );

  const onChangeText = useCallback(
    (e) => {
      setEditText(e.target.value);
    },
    [editText],
  );

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone]);

  return (
    <div>
      {editMode ? (
        <>
          <TextArea value={editText} onChange={onChangeText} />
          <Button.Group>
            <Button onClick={onChangePost(editText)}>수정</Button>
            <Button
              type="danger"
              loading={updatePostLoading}
              onClick={onCancelUpdate}
            >
              취소
            </Button>
          </Button.Group>
        </>
      ) : (
        postData.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/g)) {
            return (
              <Link href={`/hashtag/${v.slice(1)}`} key={i}>
                <a>{v}</a>
              </Link>
            );
          }
          return v;
        })
      )}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
  onChangePost: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
