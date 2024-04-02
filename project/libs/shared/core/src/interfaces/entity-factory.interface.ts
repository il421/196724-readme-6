import { IStorableEntity } from './storable-entity.interface';

export interface IEntityFactory<
  T extends IStorableEntity<ReturnType<T['toPlainData']>>
> {
  create(plainData: ReturnType<T['toPlainData']>): T;
}
