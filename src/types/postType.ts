export type PostType = {
  postId: number;
  Uid: number;
  postContent: string;
  postImage: string;
  heartsNum: number;
  createdAt: string;
  liked: boolean; // 하트 상태 추가
};
