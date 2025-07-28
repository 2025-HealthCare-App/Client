import {Reward} from './rewardType';

export type ExerciseType = {
  exerciseId: number;
  distance: number;
  steps: number;
  elapsedSec: number; //TODO: 이거 있게 할까 아니면 그냥 계산하게 할까...
  Kcal: number;
  startTime: string;
  endTime: string;
  exTitle: string | '오늘의 운동';
  staticMapUrl: //TODO: 그냥 없애기?
  | string
    | 'https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=color:0xff0000ff|weight:5|37.5031393,126.9571197&key=AIzaSyBEyEYuNOq8OreVSXUgbPSJDurTYlM6vTg';
  date: string;
  rewards?: Reward[]; // 포인트 적립 정보
};

export type ExerciseParamList = {
  Result: ExerciseType;
};

// 서버에서 받아온 운동 데이터를 ExerciseType으로 변환하는 함수
// 이 함수는 서버에서 받아온 운동 데이터의 형식에 따라 조정이 필요
export const toExerciseType = (ex: any): ExerciseType => ({
  exerciseId: ex.exercise_id,
  distance: ex.ex_distance,
  steps: ex.ex_steps,
  elapsedSec: ex.elapsedSec,
  Kcal: ex.ex_kcal,
  startTime: ex.ex_start_time,
  endTime: ex.ex_end_time,
  exTitle: ex.ex_title,
  points: ex.points,
  staticMapUrl: ex.ex_route_image,
  date: ex.created_at.split('T')[0],
});
