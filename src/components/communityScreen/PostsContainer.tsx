import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Post from './Post';
import {getPostsAPI} from '../../apis/community/postAPI';
import {PostType} from '../../types/postType';

const PostsContainer = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getPostsAPI(2)
      .then(data => {
        setPosts(
          data.posts.map((post: any) => ({
            postId: post.post_id,
            Uid: post.Uid,
            postContent: post.post_content,
            postImage: post.post_image,
            heartsNum: post.hearts_num,
            createdAt: post.created_at,
          })),
        );
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);
  return (
    <Wrapper showsVerticalScrollIndicator={false}>
      {posts.map(post => (
        <Post key={post.postId} post={post} />
      ))}
    </Wrapper>
  );
};

export default PostsContainer;

const Wrapper = styled.ScrollView`
  width: 95%;
  height: 70%;
`;
