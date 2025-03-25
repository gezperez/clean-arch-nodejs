export class Income {
  constructor(
    public id: string,
    public userId: string,
    public date: Date,
    public currency: string,
    public recurrence: string,
    public categoryId: string,
    public categoryName: string,
    public name: string,
    public description: string | null,
    public amount: string,
  ) {}
}
