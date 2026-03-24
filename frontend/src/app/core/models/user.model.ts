export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'author' | 'reader';
  createdAt: Date;
  avatar?: string;
  title?: string;
}
