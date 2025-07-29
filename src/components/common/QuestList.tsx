import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {getMyTodayQuestAPI} from '../../apis/quest/questAPI';

type Quest = {
  action_code: string;
  description: string;
  points: number;
  completed: boolean;
};

const QuestList = () => {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    getMyTodayQuestAPI()
      .then(data => {
        setQuests(data.quests);
        // console.log('퀘스트 조회 성공:', JSON.stringify(data.quests, null, 2));
      })
      .catch(error => {
        console.error('퀘스트 조회 실패:', error);
      });
  }, []);

  return (
    <Wrapper>
      {quests.map((quest, index) => (
        <Quest key={index}>
          <CheckBox completed={quest.completed}>
            {quest.completed && <CheckMark>✓</CheckMark>}
          </CheckBox>
          <QuestText completed={quest.completed}>{quest.description}</QuestText>
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
