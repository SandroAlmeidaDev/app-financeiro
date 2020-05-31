import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateDuplicatas1590963960279
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'duplicatas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'fatura_id',
            type: 'uuid',
          },
          {
            name: 'data_vencimento',
            type: 'date',
          },
          {
            name: 'parcela',
            type: 'integer',
          },
          {
            name: 'valor',
            type: 'decimal',
            precision: 15,
            scale: 2,
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
      'duplicatas',
      new TableForeignKey({
        columnNames: ['fatura_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'faturas',
        name: 'DuplicataFatura',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('duplicatas');
  }
}
