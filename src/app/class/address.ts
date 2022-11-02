import { Country } from './country';

export class Address {
  id: number;
  country: Country;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}
