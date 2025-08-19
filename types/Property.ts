import { Meter } from './Meter';

export interface Property {
  id: string;
  cadastralRecord: string;
  address: string;
  meters: Meter[];
}