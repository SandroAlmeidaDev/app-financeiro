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
            name: 'coupon_id',
            type: 'uuid',
            isNullable: true,
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
            name: 'sale_date',
            type: 'date',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cancellation_status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'origin',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'pay_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'int',
            isNullable: true,
            default: 1,
          },
          {
            name: 'parcel',
            type: 'int',
            isNullable: true,
            default: 1,
          },
          {
            name: 'covenant_company',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'authorization_number',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bin_cart',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nsu',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'card_banner',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'card_cnpj',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'note',
            type: 'varchar',
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
            columnNames: ['company_id'],
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
