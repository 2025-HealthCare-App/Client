import React from 'react';
import {Modal, Pressable} from 'react-native';
import styled from 'styled-components/native';

interface GoalModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const GoalModal = ({modalVisible, setModalVisible}: GoalModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="fade" // fade or slide
      onRequestClose={() => setModalVisible(false)}>
      <ModalBackground>
        <ModalContainer>
          <Xbutton onPress={() => setModalVisible(false)}>
            <XbuttonText>x</XbuttonText>
          </Xbutton>
          <ModalTop>
            <ModalTitle>이번주 얼마나 달릴까?</ModalTitle>
            <ModalText>
              한 번 정한 목표는 다음주까지 수정할 수 없어요!
            </ModalText>
          </ModalTop>
          <GoalBarContainer>
            <GoalBar>
              <RealGoalBar />
            </GoalBar>
            <GoalTextContainer>
              <GoalText>0km</GoalText>
              <GoalText>100km</GoalText>
            </GoalTextContainer>
          </GoalBarContainer>
          <CloseButton onPress={() => setModalVisible(false)}>
            <CloseButtonText>확인</CloseButtonText>
          </CloseButton>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default GoalModal;

//// 모달 ////
const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.View`
  width: 80%;
  padding: 40px 20px 35px 20px;
  background-color: white;
  border-radius: 15px;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
`;

const Xbutton = styled(Pressable)`
  position: absolute;
  top: 15px;
  right: 10px;
  width: 20px;
  height: 20px;
`;
const XbuttonText = styled.Text`
  font-size: 15px;
  color: #5f5f5f;
  font-weight: bold;
`;

const ModalTop = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const ModalTitle = styled.Text`
  font-size: 18px;
  color: #222831;
  font-weight: bold;
`;
const ModalText = styled.Text`
  font-size: 12px;
  color: #c1c1c1;
`;

const CloseButton = styled(Pressable)`
  width: 82px;
  height: 40px;
  background-color: #cdd800;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  font-size: 13px;
  color: white;
  font-weight: bold;
`;

//// 목표바 ////
const GoalBarContainer = styled.View`
  width: 95%;
  height: 20px;
  border-radius: 20px;
  border: 2px solid white;
`;
const GoalBar = styled.View`
  width: 100%;
  height: 100%;
  background-color: #d9d9d9;
  border-radius: 20px;
`;
const RealGoalBar = styled.View`
  width: 50%;
  height: 100%;
  background-color: #ff9292;
  border-radius: 20px;
`;

const GoalTextContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const GoalText = styled.Text`
  font-size: 10px;
  color: #646464;
  text-align: center;
`;
