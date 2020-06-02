import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBarCodes1591064873463 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bar_codes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_code',
            type: 'integer',
          },
          {
            name: 'bar_code',
            type: 'integer',
          },
          {
            name: 'packing',
            type: 'integer',
            default: 1,
          },
          {
            name: 'pack_description',
            type: 'varchar',
          },
          {
            name: 'sku',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'packing_unit',
            type: 'varchar',
          },
          {
            name: 'pack_cost_price',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'pack_sale_price',
            type: 'decimal',
            precision: 15,
            scale: 10,
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
    await queryRunner.dropTable('bar_codes');
  }
}
