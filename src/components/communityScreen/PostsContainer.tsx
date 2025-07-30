import React, {useEffect, useState, useCallback} from 'react';
import styled from 'styled-components/native';
import Post from './Post';
import {getPostsAPI} from '../../apis/community/postAPI';
import {PostType} from '../../types/postType';

const PostsContainer = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1); // 현재 페이지 번호
  const [loading, setLoading] = useState(false); // 중복 요청 방지
  const [hasMore, setHasMore] = useState(true); // 다음 페이지 여부

  // API 호출
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);

    try {
      const data = await getPostsAPI(page);

      if (data.posts.length === 0) {
        setHasMore(false); // 더 이상 불러올 데이터 없음
        return;
      }

      setPosts(prev => [
        ...prev,
        ...data.posts.map((post: any) => ({
          postId: post.post_id,
          Uid: post.Uid,
          postContent: post.post_content,
          postImage: post.post_image,
          heartsNum: post.hearts_num,
          createdAt: post.created_at,
          liked: post.liked,
          tier: post.tier,
          name: post.name,
        })),
      ]);

      setPage(prev => prev + 1); // 다음 페이지로 이동
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // 첫 로딩
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <FlatListWrapper
      data={posts}
      keyExtractor={item => item.postId.toString()}
      renderItem={({item}) => <Post post={item} />}
      onEndReached={fetchPosts} // 끝에 도달하면 다음 페이지 로드
      onEndReachedThreshold={0.5} // 스크롤 50% 지점에서 미리 로드
      ListFooterComponent={
        loading ? <LoadingText>로딩 중...</LoadingText> : null
      }
    />
  );
};

export default PostsContainer;

const FlatListWrapper = styled.FlatList`
  width: 95%;
  height: 70%;
`;

const LoadingText = styled.Text`
  text-align: center;
  padding: 10px;
  color: gray;
`;
