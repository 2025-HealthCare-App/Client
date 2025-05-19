import React from 'react';
import {Image, Modal, Pressable} from 'react-native';
import styled from 'styled-components/native';

interface GoalModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const LevelModal = ({modalVisible, setModalVisible}: GoalModalProps) => {
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

          <ModalTitle>러너 등급</ModalTitle>
          <LevelsContainer>
            <Row>
              <Level>
                <TierBadge source={require('../../images/tierBadge.png')} />
                <LevelText>지존</LevelText>
              </Level>
              <Description>상위 25%</Description>
            </Row>
            <Row>
              <Level>
                <TierBadge source={require('../../images/tierBadge.png')} />
                <LevelText>고수</LevelText>
              </Level>
              <Description>상위 50%</Description>
            </Row>
            <Row>
              <Level>
                <TierBadge source={require('../../images/tierBadge.png')} />
                <LevelText>중수</LevelText>
              </Level>
              <Description>상위 75%</Description>
            </Row>
            <Row>
              <Level>
                <TierBadge source={require('../../images/tierBadge.png')} />
                <LevelText>하수</LevelText>
              </Level>
              <Description>상위 100%</Description>
            </Row>
          </LevelsContainer>
          <Caution>러너 등급은 지난주에 달린 거리로 결정돼요.</Caution>
        </ModalContainer>
      </ModalBackground>
    </Modal>
  );
};

export default LevelModal;

//// 모달 ////
const ModalBackground = styled(Pressable)`
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

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: rgba(34, 40, 49, 0.92);
`;

const LevelsContainer = styled.View`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;
const Row = styled.View`
  flex-direction: row;
  width: 60%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const Level = styled.View`
  flex-direction: row;
  padding: 4px 20px;
  justify-content: space-between;
  align-items: center;
  background-color: #ffebc0;
  border: 2px solid #c0b08f;
  border-radius: 50px;
  gap: 10px;
`;
const LevelText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;
const Description = styled.Text`
  font-size: 10px;
  color: #c0c0c0;
  text-align: center;
`;
const TierBadge = styled(Image)`
  width: 35px;
  height: 35px;
`;

const Caution = styled.Text`
  font-size: 11px;
  color: #c0c0c0;
  text-align: center;
`;
