import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCompanies1591064314551
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'companies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'cnpj',
            type: 'bigint',
          },
          {
            name: 'company_code',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'state_registration',
            type: 'varchar',
          },
          {
            name: 'comapany_name',
            type: 'varchar',
          },
          {
            name: 'fantasy_name',
            type: 'varchar',
          },
          {
            name: 'adress',
            type: 'varchar',
          },
          {
            name: 'number',
            type: 'varchar',
          },
          {
            name: 'district',
            type: 'varchar',
          },
          {
            name: 'complement',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'zip_code',
            type: 'varchar',
          },
          {
            name: 'city',
            type: 'varchar',
          },
          {
            name: 'state',
            type: 'varchar',
          },
          {
            name: 'commercial_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cell_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
          },
          {
            name: 'company_type',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}
