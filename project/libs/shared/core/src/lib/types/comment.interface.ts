export interface Comment {
  id?: string;
  postId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
}
