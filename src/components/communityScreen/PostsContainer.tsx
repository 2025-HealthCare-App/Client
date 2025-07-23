import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import Post from './Post';
import {getPostsAPI} from '../../apis/community/postAPI';
import {PostType} from '../../types/postType';

const PostsContainer = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getPostsAPI(1) //TODO: 무한 스크롤 구현을 위해 페이지 번호를 동적으로 변경
      .then(data => {
        //data를 json 형태로 예쁘게 출력
        console.log('게시글 조회 성공:', JSON.stringify(data, null, 2));
        setPosts(
          data.posts.map((post: any) => ({
            postId: post.post_id,
            Uid: post.Uid,
            postContent: post.post_content,
            postImage: post.post_image,
            heartsNum: post.hearts_num,
            createdAt: post.created_at,
            liked: post.liked,
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
