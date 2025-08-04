import React, {useState} from 'react';
import {Alert, Modal, Pressable} from 'react-native';
import styled from 'styled-components/native';
import {PanResponder, Animated, Dimensions} from 'react-native';
import {postOrPatchMyWeekGoalAPI} from '../../apis/week-ex/weekExApi';

interface GoalModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  setGoal: (goal: number) => void; // 부모로부터 목표 설정 함수 전달
  setIsGoalSet: (isSet: boolean) => void; // 목표 설정 여부 상태 업데이트 함수 (선택적)
}

const GoalModal = ({
  modalVisible,
  setModalVisible,
  setGoal,
  setIsGoalSet,
}: GoalModalProps) => {
  const [realGoalBarWidth, setRealGoalBarWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(270); // GoalBar 전체 폭
  const [goalKm, setGoalKm] = useState(0); // 현재 목표 거리 표시용
  const screenWidth = Dimensions.get('window').width;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newWidth = Math.min(
          Math.max(gestureState.moveX - (screenWidth - containerWidth) / 2, 0),
          containerWidth,
        );
        setRealGoalBarWidth(newWidth);

        // 비율 계산 (0~100km)
        const ratio = newWidth / containerWidth;
        const km = Math.round(ratio * 100); // 최대 100km 기준
        setGoalKm(km);
      },
    }),
  ).current;

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
          <GoalBarContainer
            onLayout={event => {
              const {width} = event.nativeEvent.layout;
              setContainerWidth(width);
            }}>
            <GoalBar>
              <RealGoalBar style={{width: realGoalBarWidth}}>
                <Thumb
                  {...panResponder.panHandlers}
                  style={{left: realGoalBarWidth - 10}}
                />
              </RealGoalBar>
            </GoalBar>

            <GoalTextContainer>
              <GoalText>0km</GoalText>
              <GoalText>100km</GoalText>
            </GoalTextContainer>
          </GoalBarContainer>

          <RealGoalText>{goalKm}Km</RealGoalText>
          <CloseButton
            onPress={() => {
              setModalVisible(false);
              setGoal(goalKm * 1000); // 목표 설정 후 부모 컴포넌트에 전달
              setRealGoalBarWidth(0); // 모달 닫을 때 바 초기화
              setContainerWidth(270); // 모달 닫을 때 컨테이너 폭 초기화
              setGoalKm(0); // 목표 거리 초기화
              setIsGoalSet(true); // 목표 설정 여부 업데이트

              //목표 설정 API 호출
              postOrPatchMyWeekGoalAPI(goalKm * 1000)
                .then(() => {
                  console.log('목표 설정 성공:', goalKm);
                  Alert.alert(
                    '목표 설정 완료',
                    `이번 주 목표는 ${goalKm}km 입니다!`,
                  );
                })
                .catch(error => {
                  console.error('목표 설정 실패:', error);
                });
            }}>
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

// const CloseButton = styled(Pressable)`
//   width: 82px;
//   height: 40px;
//   background-color: #cdd800;
//   border-radius: 5px;
//   justify-content: center;
//   align-items: center;
// `;
const CloseButton = styled.TouchableOpacity`
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

const Thumb = styled(Animated.View)`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: #d06363;
  top: -3.5px; /* RealGoalBar보다 살짝 위로 */
`;

const RealGoalText = styled.Text`
  font-size: 20px;
  color: #222831;
  font-weight: bold;
  text-decoration: underline;
`;
