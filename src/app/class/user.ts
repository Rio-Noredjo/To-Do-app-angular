import { Address } from './address';

export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRoles: string;
  address: Address;
}
