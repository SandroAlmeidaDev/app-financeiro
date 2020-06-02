import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateOrderingProducts1591066708875
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ordering_products',
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
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'order_number',
            type: 'integer',
          },
          {
            name: 'order_quantity',
            type: 'decimal',
            precision: 10,
            scale: 6,
          },
          {
            name: 'order_pack',
            type: 'integer',
          },
          {
            name: 'unitary_value',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'discount_amount',
            type: 'decimal',
            precision: 10,
            scale: 6,
          },
          // Campos referente a impostos
          {
            name: 'ipi_codigo_enquadramento_legal',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'icms_percentual_partilha',
            type: 'decimal',
            precision: 4,
            scale: 4,
            isNullable: true,
          },
          {
            name: 'icms_origem',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'icms_situacao_tributaria',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'icms_base_calculo_retido_st',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'icms_aliquota_final',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'icms_valor_substituto',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'icms_valor_retido_st',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ipi_situacao_tributaria',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'ipi_base_calculo',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ipi_aliquota',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'ipi_valor',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pis_situacao_tributaria',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'pis_base_calculo',
            type: 'decimal',
            precision: 15,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pis_aliquota_porcentual',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'pis_valor',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'cofins_situacao_tributaria',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'cofins_base_calculo',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'cofins_aliquota_porcentual',
            type: 'decimal',
            precision: 2,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'cofins_valor',
            type: 'decimal',
            precision: 10,
            scale: 2,
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
      'ordering_products',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        name: 'OrderingProductCompany',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ordering_products');
  }
}
