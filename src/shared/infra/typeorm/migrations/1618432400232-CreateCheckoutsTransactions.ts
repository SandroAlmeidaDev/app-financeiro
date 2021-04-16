import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCheckoutsTransactions1618432400232
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'checkouts_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'company_id',
            type: 'uuid',
          },
          {
            name: 'checkout_id',
            type: 'uuid',
          },
          {
            name: 'operator',
            type: 'int',
          },
          {
            name: 'coupon',
            type: 'bigint',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'parcel',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'sale_date',
            type: 'date',
          },
          {
            name: 'sale_due_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 20,
            scale: 6,
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
        foreignKeys: [
          {
            name: 'CompanyCheckoutsTransaction',
            columnNames: ['comapany_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            name: 'CheckoutsTransaction',
            columnNames: ['checkout_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'checkouts',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('checkouts_transactions');
  }
}
