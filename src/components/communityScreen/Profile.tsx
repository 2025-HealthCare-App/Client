import React from 'react';
import styled from 'styled-components/native';

interface ProfileProps {
  name?: string;
  imgSrc: any; // 이미지 경로는 require로 가져온 객체
  km?: number;
}

const Profile = ({name, imgSrc, km}: ProfileProps) => {
  return (
    <Wrapper>
      <ProfileImage source={imgSrc} />
      <ProfileName>{name}</ProfileName>
      <Km>{km}km</Km>
    </Wrapper>
  );
};

export default Profile;

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`;
const ProfileImage = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 100px;
  margin-bottom: 5px;
  border: 1px solid #ffffff;
`;
const ProfileName = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  max-width: 80px; /* 이름이 너무 길어지지 않도록 제한 */
`;
const Km = styled.Text`
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  text-decoration: underline;
`;
