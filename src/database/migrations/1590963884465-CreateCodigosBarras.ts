import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateCodigosBarras1590963884465
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'codigos_barras',
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
            name: 'codigo_barras',
            type: 'integer',
          },
          {
            name: 'qtde_embalagem',
            type: 'integer',
            default: 1,
          },
          {
            name: 'descricao_embalagem',
            type: 'varchar',
          },
          {
            name: 'sku',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'unidade_medida',
            type: 'varchar',
          },
          {
            name: 'preco_custo_embalagem',
            type: 'decimal',
            precision: 15,
            scale: 10,
          },
          {
            name: 'preco_venda_embalagem',
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
    await queryRunner.dropTable('codigos_barras');
  }
}
