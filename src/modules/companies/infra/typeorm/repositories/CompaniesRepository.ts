import { getRepository, Repository } from 'typeorm';

import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/companies/dtos/ICreateCompanyDTO';
import Company from '../entities/Company';

class CompaniesRepository implements ICompaniesRepository {
  private ormRepository: Repository<Company>;

  constructor() {
    this.ormRepository = getRepository(Company);
  }

  public async create(companyData: ICreateCompanyDTO): Promise<Company> {
    const company = this.ormRepository.create(companyData);

    await this.ormRepository.save(company);

    return company;
  }

  public async save(company: Company): Promise<Company> {
    return this.ormRepository.save(company);
  }

  public async findById(id: string): Promise<Company | undefined> {
    const findCompany = await this.ormRepository.findOne(id);

    return findCompany;
  }

  public async findByCnpj(cnpj: number): Promise<Company | undefined> {
    const findCompany = await this.ormRepository.findOne({
      where: {
        cnpj,
      },
    });

    return findCompany;
  }
}

export default CompaniesRepository;
