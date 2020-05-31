import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export default class AltColunaCodigoBarrasProduto1590965393041
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'produtos',
      new TableForeignKey({
        name: 'ProdutoCodigoBarras',
        columnNames: ['codigo_barras_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'codigos_barras',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('produtos', 'ProdutoCodigoBarras');
  }
}
