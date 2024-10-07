export class Expense {
  constructor(
    public id: string,
    public userId: string,
    public categoryId: string,
    public name: string,
    public amount: number,
    public date: Date,
  ) {}
}
