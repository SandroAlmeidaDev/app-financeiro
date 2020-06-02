import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateProducts1591065307787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'products',
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
            name: 'bar_code_id',
            type: 'uuid',
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'unit_measure',
            type: 'varchar',
          },
          {
            name: 'stock',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'cost_price',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'sale_price',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'data_cadastro',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'data_compra',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'registration_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'ncm',
            type: 'integer',
          },
          {
            name: 'cest',
            type: 'integer',
          },
          {
            name: 'icms_tax_sale',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'icms_tax_purchase',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'taxation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type_pis_cofins',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'nature_pis_cofins',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'type_ipi',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'ipi_value',
            type: 'decimal',
            precision: 10,
            scale: 10,
          },
          {
            name: 'fiscal_type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'product_avatar',
            type: 'varchar',
            isNullable: true,
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

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        name: 'ProductBarCode',
        columnNames: ['bar_code_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'bar_codes',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
  }
}
