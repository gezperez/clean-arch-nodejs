export class Expense {
  constructor(
    public id: string,
    public userId: string,
    public categoryId: string,
    public categoryName: string,
    public name: string,
    public amount: string,
    public date: Date,
    public currency: string,
    public recurrence: string,
    public description: string,
  ) {}
}
