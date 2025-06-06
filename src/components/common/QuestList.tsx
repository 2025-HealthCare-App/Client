import React from 'react';
import styled from 'styled-components/native';

type QuestId = 'quest1' | 'quest2' | 'quest3' | 'quest4';

const QuestList = () => {
  const completedQuests: Record<QuestId, boolean> = {
    quest1: true, // 오늘 운동 시작하기는 완료된 상태
    quest2: true,
    quest3: false,
    quest4: false,
  };

  const questData: {id: QuestId; text: string; points: string}[] = [
    {id: 'quest1', text: '오늘 운동 시작하기', points: '50 P'},
    {id: 'quest2', text: '1km 걷기', points: '100 P'},
    {id: 'quest3', text: '3km 걷기', points: '150 P'},
    {id: 'quest4', text: '오늘의 게시글 작성하기', points: '100 P'},
  ];

  return (
    <Wrapper>
      {questData.map(quest => (
        <Quest key={quest.id}>
          <CheckBox completed={completedQuests[quest.id]}>
            {completedQuests[quest.id] && <CheckMark>✓</CheckMark>}
          </CheckBox>
          <QuestText completed={completedQuests[quest.id]}>
            {quest.text}
          </QuestText>
          <PointContainer>
            <PointIcon source={require('../../images/point.png')} />
            <PointText>{quest.points}</PointText>
          </PointContainer>
        </Quest>
      ))}
    </Wrapper>
  );
};

export default QuestList;

const Wrapper = styled.View`
  width: 100%;
  gap: 20px;
`;

const Quest = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface CheckBoxProps {
  completed: boolean;
}

const CheckBox = styled.View<CheckBoxProps>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid ${props => (props.completed ? '#4CAF50' : '#cccccc')};
  background-color: ${props => (props.completed ? '#4CAF50' : 'transparent')};
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const CheckMark = styled.Text`
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
`;

interface QuestTextProps {
  completed: boolean;
}

const QuestText = styled.Text<QuestTextProps>`
  flex: 1;
  font-size: 14px;
  color: ${props => (props.completed ? '#999999' : '#333333')};
  text-decoration-line: ${props => (props.completed ? 'line-through' : 'none')};
`;

const PointContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const PointIcon = styled.Image`
  width: 14px;
  height: 14px;
`;

const PointText = styled.Text`
  font-size: 12px;
  color: #ff9500;
  font-weight: bold;
`;
