export interface User {
  id?: string;
  email: string;
  name: string;
  avatar?: string;
  registerDate: Date;
  subscribersCount: number;
  postsCount: number;
  subscriptions: string[];
}
