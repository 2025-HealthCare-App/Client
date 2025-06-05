import React from 'react';
import styled from 'styled-components/native';

interface ProfileProps {
  name: string;
  imgSrc: any;
  km: number;
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
  km,
  isFirst,
  isSecond,
  isThird,
}: ProfileProps) => {
  return (
    <Wrapper isSecond={isSecond} isThird={isThird}>
      <ProfileImage source={imgSrc} isFirst={isFirst} />
      <ProfileName>{name}</ProfileName>
      <Km>{km}km</Km>
    </Wrapper>
  );
};

export default Profile;

const Wrapper = styled.View<WrapperProps>`
  justify-content: center;
  align-items: center;
  margin-top: ${props => (props.isSecond || props.isThird ? '50px' : '0px')};
`;

const ProfileImage = styled.Image<ImageProps>`
  width: ${props => (props.isFirst ? '100px' : '80px')};
  height: ${props => (props.isFirst ? '100px' : '80px')};
  border-radius: 100px;
  margin-bottom: 5px;
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
