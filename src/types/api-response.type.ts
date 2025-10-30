export interface ResponseFunc<T extends object = undefined> {
  data?: T;
  status: number | boolean;
  message: string;
}
