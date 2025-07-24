import React from 'react';
import styled from 'styled-components/native';

interface ProfileProps {
  name: string;
  imgSrc: any;
  total_distance: number;
  isFirst?: boolean;
  isSecond?: boolean;
  isThird?: boolean;
}

// styled-components용 인터페이스 추가
interface WrapperProps {
  isSecond?: boolean;
  isThird?: boolean;
}

interface ImageProps {
  isFirst?: boolean;
}

const Profile = ({
  name,
  imgSrc,
  total_distance,
  isFirst,
  isSecond,
  isThird,
}: ProfileProps) => {
  const getRankImage = () => {
    if (isFirst) {
      return require('../../images/medals/medal1.png');
    }
    if (isSecond) {
      return require('../../images/medals/medal2.png');
    }
    if (isThird) {
      return require('../../images/medals/medal3.png');
    }
    return null;
  };

  // 네트워크 이미지와 로컬 이미지 분기 처리
  const getProfileImageSource = (src: any) => {
    if (typeof src === 'string') {
      return {uri: src};
    }
    return src;
  };

  return (
    <Wrapper isSecond={isSecond} isThird={isThird}>
      <ImageContainer>
        <ProfileImage
          source={getProfileImageSource(imgSrc)}
          isFirst={isFirst}
        />
        {getRankImage() && <RankBadge source={getRankImage()} />}
      </ImageContainer>
      <ProfileName>{name}</ProfileName>
      <Km>{(total_distance / 1000).toLocaleString()}km</Km>
    </Wrapper>
  );
};

export default Profile;

const Wrapper = styled.View<WrapperProps>`
  justify-content: center;
  align-items: center;
  margin-top: ${props => (props.isSecond || props.isThird ? '50px' : '0px')};
`;

const ImageContainer = styled.View`
  position: relative;
  margin-bottom: 5px;
`;

const RankBadge = styled.Image`
  position: absolute;
  top: -3px;
  left: -5px;
  width: 32px;
  height: 32px;
  z-index: 10;
`;

const ProfileImage = styled.Image<ImageProps>`
  width: ${props => (props.isFirst ? '100px' : '80px')};
  height: ${props => (props.isFirst ? '100px' : '80px')};
  border-radius: 100px;
  border: 1px solid #ffffff;
`;

const ProfileName = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  max-width: 80px;
`;

const Km = styled.Text`
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  text-decoration: underline;
`;
