export const MAX_COMMENTS_COUNT = 50;

export const BlogCommentValidateMessage = {
  MessageIsEmpty: 'The message is empty',
  InvalidID: 'Invalid author id',
} as const;

export const BlogCommentResponse = {
  CommentsFound: 'Successfully found comments of the post',
  CommentCreated: 'Successfully create comment',
  CommentDeleted: 'Successfully delete comment',
  PostNotFound: 'Post not found',
  CommentNotFound: 'Comment not found',
  NotAllowed: 'You are not allowed to deletec this comment',
} as const;
