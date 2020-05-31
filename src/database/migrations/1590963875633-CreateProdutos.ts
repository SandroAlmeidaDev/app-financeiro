import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateProdutos1590963875633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'produtos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'codigo_produto',
            type: 'integer',
          },
          {
            name: 'codigo_barras_id',
            type: 'uuid',
          },
          {
            name: 'descricao',
            type: 'varchar',
          },
          {
            name: 'unidade_medida',
            type: 'varchar',
          },
          {
            name: 'estoque',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'preco_custo',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'preco_venda',
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
            name: 'data_venda',
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
            name: 'aliquota_icms_venda',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'aliquota_icms_compra',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tributacao',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'tipo_pis_cofins',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'natureza_pis_cofins',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'tipo_ipi',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'valor_ipi',
            type: 'decimal',
            precision: 10,
            scale: 10,
          },
          {
            name: 'tipo_fiscal',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'foto',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('produtos');
  }
}
