import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCouponsProducts1618444833475
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'coupons_products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'comapany_id',
            type: 'uuid',
          },
          {
            name: 'checkout_id',
            type: 'uuid',
          },
          {
            name: 'coupon',
            type: 'bigint',
          },
          {
            name: 'erp_product_id',
            type: 'bigint',
          },
          {
            name: 'bar_code',
            type: 'bigint',
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'unit_price',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'hour',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'sale_date',
            type: 'date',
          },
          {
            name: 'erp_offer_id',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'is_canceled',
            type: 'boolean',
            default: false,
          },
          {
            name: 'order',
            type: 'int',
          },
          {
            name: 'erp_customer_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'erp_seller_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'operator',
            type: 'int',
          },
          {
            name: 'erp_department_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'aliquot_icms',
            type: 'decimal',
            precision: 6,
            scale: 2,
          },
          {
            name: 'normal_price',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'type_price',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'type_taxation',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'model_doc',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'motive_discount',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'serie_nf',
            type: 'char',
            isNullable: true,
          },
          {
            name: 'erp_promo_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'erp_order_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'bc_pis',
            type: 'decimal',
            precision: 10,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'bc_cofins',
            type: 'decimal',
            precision: 10,
            scale: 6,
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
        foreignKeys: [
          {
            name: 'CompanyCouponsProducts',
            columnNames: ['comapany_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          {
            name: 'CheckoutsCouponsProducts',
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
    await queryRunner.dropTable('coupons_products');
  }
}
