import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import styled from 'styled-components/native';
import {uploadPost} from '../apis/community/postAPI';

const WriteScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  //게시글 post API
  const handlePostSubmit = async () => {
    try {
      const response = await uploadPost({postContent, imageUri: selectedImage});
      if (response.success) {
        Alert.alert('게시글 작성 완료', '게시글이 성공적으로 작성되었습니다!');
        navigation.navigate('Community'); // 게시글 작성 후 커뮤니티 화면으로 이동
      } else {
        console.error('게시글 작성 실패:', response.message);
      }
    } catch (error) {
      console.error('게시글 작성 중 오류 발생:', error);
    }
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          console.log('사용자가 취소함');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setSelectedImage(asset.uri);
          console.log('선택된 이미지: ', asset.uri);
        }
      },
    );
  };

  //뒤로가기
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <Wrapper>
      <Header>
        <TouchableOpacity onPress={goBack}>
          <BeforeButtonText>&lt;</BeforeButtonText>
        </TouchableOpacity>
        <HeaderText>게시글 작성</HeaderText>
      </Header>
      <Main>
        <TextInput
          placeholder="본문을 작성해주세요.(최대 50자)"
          placeholderTextColor="#9ca3af"
          multiline={true} // ✅ 줄바꿈 가능
          maxLength={50} // ✅ 최대 글자 수 제한
          textAlignVertical="top" // ✅ 입력 내용 위쪽부터 시작
          value={postContent}
          onChangeText={text => setPostContent(text)}
          style={{textAlign: 'left'}} // ✅ 왼쪽 정렬
        />
        {selectedImage ? (
          <PreviewImage source={{uri: selectedImage}} />
        ) : (
          <ImageUploadContainer>
            <ImageUploadButton onPress={handleImageUpload}>
              <UploadImage source={require('../images/upload-icon.png')} />
            </ImageUploadButton>
            <ImageUploadButtonText>사진 업로드</ImageUploadButtonText>
          </ImageUploadContainer>
        )}
        <SubmitButton onPress={handlePostSubmit}>
          <SubmitButtonText>작성 완료</SubmitButtonText>
        </SubmitButton>
      </Main>
    </Wrapper>
  );
};

export default WriteScreen;

const Wrapper = styled.View`
  height: 100%;
  width: 100%;
  background-color: #222831;
  padding: 20px 20px;
  gap: 30px;
`;

const Header = styled.View`
  width: 100%;
  height: 7%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 10px;
  gap: 10px;
`;
const BeforeButtonText = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;
const HeaderText = styled.Text`
  font-size: 20px;
  color: #ffffff;
  font-weight: bold;
`;

const Main = styled.View`
  height: 93%;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding-bottom: 80px;
`;
const ImageUploadContainer = styled.View`
  width: 350px;
  height: 350px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  border: 1.5px solid #4f5661;
`;
const PreviewImage = styled.Image`
  width: 350px;
  height: 350px;
  border-radius: 10px;
  border: 1.5px solid #4f5661;
`;

const ImageUploadButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
`;
const UploadImage = styled.Image`
  width: 40px;
  height: 40px;
`;
const ImageUploadButtonText = styled.Text`
  font-size: 14px;
  color: #4b525c;
`;
const TextInput = styled.TextInput`
  width: 350px;
  height: 80px;
  background-color: #343d4a;
  border-radius: 5px;
  font-size: 12px;
  padding: 20px;
  color: #ffffff;
`;
const SubmitButton = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  background-color: #bcc600;
  border: 2.5px solid #fff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
`;
const SubmitButtonText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
`;
