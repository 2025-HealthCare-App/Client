export type PostType = {
  postId: number;
  Uid: number;
  postContent: string;
  postImage: string;
  heartsNum: number;
  createdAt: string;
  liked: boolean; // 하트 상태 추가

  //작성자 관련 정보
  tier: number; // 작성자 티어
  name: string; // 작성자 이름
};
