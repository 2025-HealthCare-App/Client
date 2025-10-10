import React, {useEffect} from 'react';
import styled from 'styled-components/native';

interface RunningButtonProps {
  onPress?: () => void;
  option: 'pause' | 'start' | 'stop';
}

const RunningButton = ({onPress, option}: RunningButtonProps) => {
  useEffect(() => {
    console.log(`option: ${option}`);
  }, [option]);

  return (
    <Wrapper onPress={onPress} option={option}>
      {option === 'pause' && (
        <PauseShape>
          <Stick />
          <Stick />
        </PauseShape>
      )}
      {option === 'stop' && <StopShape />}
      {option === 'start' && <StartShape />}
    </Wrapper>
  );
};

export default RunningButton;

const Wrapper = styled.TouchableOpacity<{option: 'pause' | 'start' | 'stop'}>`
  background-color: ${({option}) => {
    const colorMap = {
      pause: '#1a1a1a',
      start: '#0da563',
      stop: '#1a1a1a',
    };
    return colorMap[option];
  }};
  width: 100px;
  height: 100px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  elevation: 7;
`;

const PauseShape = styled.View`
  z-index: 2;
  width: 17%;
  height: 23%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Stick = styled.View`
  height: 100%;
  width: 5px;
  background-color: #ffffff;
`;

const StopShape = styled.View`
  width: 23%;
  height: 23%;
  background-color: #ffffff;
`;

const StartShape = styled.View`
  width: 23%;
  height: 23%;
  background-color: transparent;

  /* 삼각형 만들기 */
  border-top-width: 15px;
  border-top-color: transparent;

  border-bottom-width: 15px;
  border-bottom-color: transparent;

  border-left-width: 25px;
  border-left-color: #ffffff; /* 원하는 삼각형 색 */
`;
