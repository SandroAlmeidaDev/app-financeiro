import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

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
            isNullable: true,
          },
          {
            name: 'total_price',
            type: 'decimal',
            precision: 20,
            scale: 6,
          },
          {
            name: 'hour',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'sale_date',
            type: 'date',
          },
          {
            name: 'erp_offer_id',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cancellation_type',
            type: 'varchar',
            isNullable: true,
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
            isNullable: true,
          },
          {
            name: 'normal_price',
            type: 'decimal',
            precision: 20,
            scale: 6,
            isNullable: true,
          },
          {
            name: 'type_price',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'type_taxation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'model_doc',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'motive_discount',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'serie_nf',
            type: 'varchar',
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
            columnNames: ['company_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'companies',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'CheckoutsCouponsProducts',
            columnNames: ['checkout_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'checkouts',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          {
            name: 'CheckoutsSalesCoupons',
            columnNames: ['coupon_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'checkouts_sales_coupons',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'coupons_products',
      new TableIndex({
        name: 'IDX_COUPON_PRODUCT_UNIQUE',
        columnNames: [
          'company_id',
          'checkout_id',
          'operator',
          'coupon',
          'sale_date',
          'order',
          'bar_code',
          'erp_product_id',
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('coupons_products');
  }
}
