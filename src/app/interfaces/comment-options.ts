export interface CommentOptions {
  id: number;
  postId: number;
  username: string;
  text: string;
  createdAt: number;
  profilePicture: string;
  canDelete: boolean;
}
