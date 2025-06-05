import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import BottomBar from '../components/common/BottomBar';
import RankingBoard from '../components/communityScreen/RankingBoard';
import WriteButton from '../components/communityScreen/WriteButton';
import PostsContainer from '../components/communityScreen/PostsContainer';
import {Animated, TouchableOpacity} from 'react-native';

const CommunityScreen = () => {
  const [isPosted, setIsPosted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const animatedHeight = useRef(new Animated.Value(1)).current; // 1 = 펼쳐진 상태

  const toggleRankingBoard = () => {
    const toValue = isCollapsed ? 1 : 0; // 0 = 접힌 상태

    Animated.timing(animatedHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsCollapsed(!isCollapsed);
  };

  return (
    <Wrapper>
      <Animated.View
        style={{
          width: '100%',
          height: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [80, 320], // 접힌 높이 80px, 펼친 높이 320px
          }),
          overflow: 'hidden',
        }}>
        <RankingBoard />

        {/* 토글 버튼 */}
        <ToggleButton onPress={toggleRankingBoard}>
          <ToggleText>{isCollapsed ? '▼' : '▲'}</ToggleText>
        </ToggleButton>
      </Animated.View>

      <WriteButton isPosted={isPosted} setIsPosted={setIsPosted} />
      <PostsContainer />
      <BottomBar />
    </Wrapper>
  );
};

export default CommunityScreen;

const Wrapper = styled.View`
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  align-items: center;
  background-color: #222831;
  padding: 0px 20px;
  padding-bottom: 60px; /* bottomBar 높이만큼 여백 추가 */
`;

const ToggleButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 10px;
  right: 15px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 8px 12px;
  z-index: 10;
`;

const ToggleText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;
