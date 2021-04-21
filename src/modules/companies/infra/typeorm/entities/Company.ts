import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cnpj: number;

  @Column()
  state_registration: string;

  @Column()
  company_name: string;

  @Column()
  company_code: number;

  @Column()
  fantasy_name: string;

  @Column()
  adress: string;

  @Column()
  number: string;

  @Column()
  district: string;

  @Column()
  complement: string;

  @Column()
  zip_code: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  commercial_phone: string;

  @Column()
  cell_phone: string;

  @Column()
  email: string;

  @Column()
  company_type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Company;
