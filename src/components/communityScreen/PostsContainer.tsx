import React from 'react';
import styled from 'styled-components/native';
import Post from './Post';

const PostsContainer = () => {
  return (
    <Wrapper showsVerticalScrollIndicator={false}>
      <Post />
      <Post />
      <Post />
    </Wrapper>
  );
};

export default PostsContainer;

const Wrapper = styled.ScrollView`
  width: 95%;
  height: 70%;
`;
