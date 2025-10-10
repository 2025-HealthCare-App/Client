import React from 'react';
import {Modal, Pressable} from 'react-native';
import styled from 'styled-components/native';
import QuestList from './QuestList';

interface GoalModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const QuestModal = ({modalVisible, setModalVisible}: GoalModalProps) => {
  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="fade" // fade or slide
      onRequestClose={() => setModalVisible(false)}>
      <ModalBackground onPress={() => setModalVisible(false)}>
        <ModalContainer>
          <Xbutton onPress={() => setModalVisible(false)}>
            <XbuttonText>x</XbuttonText>
          </Xbutton>
          <ModalTop>
            <ModalTitle>오늘의 퀘스트</ModalTitle>
            <QuestList />
          </ModalTop>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default QuestModal;

//// 모달 ////
const ModalBackground = styled.Pressable`
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
  width: 95%;
  justify-content: center;
  align-items: center;
`;
const ModalTitle = styled.Text`
  width: 100%;
  font-size: 18px;
  color: #1a1a1a;
  font-weight: bold;
  margin-bottom: 25px;
`;
