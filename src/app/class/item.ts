import { User } from './user';

export class Item {
  id: number;
  title: string;
  content: string;
  status: string;
  lastUpdated: string;
  user: User;
}
