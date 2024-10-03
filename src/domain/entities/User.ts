export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public theme: string,
    public currency: string,
    public password: string,
  ) {}
}
