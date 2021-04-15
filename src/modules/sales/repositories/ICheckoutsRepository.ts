import { UpdateResult } from 'typeorm';
import Checkout from '../infra/typeorm/entities/Checkout';
import ICreateCheckoutDTO from '../dtos/ICreateCheckoutDTO';

export default interface ICheckoutsRepository {
  create(data: ICreateCheckoutDTO): Promise<Checkout>;
  update(id: string, data: ICreateCheckoutDTO): Promise<UpdateResult>;

  findById(id: string): Promise<Checkout | undefined>;
  findByCompanyIdNumber(
    company_id: string,
    number: number,
  ): Promise<Checkout | undefined>;
}
