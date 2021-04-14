import Company from '../infra/typeorm/entities/Company';

import ICreateCompanyDTO from '../dtos/ICreateCompanyDTO';

export default interface ICompanysRepository {
  create(data: ICreateCompanyDTO): Promise<Company>;
  findByCnpj(cnpj: number): Promise<Company | undefined>;
  findById(id: string): Promise<Company | undefined>;
}
