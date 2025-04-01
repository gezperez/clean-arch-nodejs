import { Category } from './Category';

export type MovementType = 'EXPENSE' | 'INCOME';

export class Movement {
  constructor(
    public id: string,
    public userId: string,
    public currency: string,
    public recurrence: string,
    public name: string,
    public description: string,
    public amount: string,
    public type: MovementType,
    public createdAt: Date,
    public updatedAt: Date,
    public categoryId: string,
    public category?: Category,
  ) {}
}
