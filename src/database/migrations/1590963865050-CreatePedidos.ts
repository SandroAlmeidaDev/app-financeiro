import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreatePedidos1590963865050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'pedidos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'empresa_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'numero_pedido',
            type: 'integer',
          },
          {
            name: 'status_pedido',
            type: 'varchar',
          },
          {
            name: 'tipo_pedido',
            type: 'varchar',
          },
          {
            name: 'valor_total',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'data_emissao',
            type: 'timestamp with time zone',
          },
          {
            name: 'data_entrega',
            type: 'timestamp with time zone',
          },
          {
            name: 'data_recebimento',
            type: 'timestamp with time zone',
          },
          {
            name: 'note',
            type: 'varchar',
          },
          {
            name: 'tipo_frete',
            type: 'integer',
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
      'pedidos',
      new TableForeignKey({
        columnNames: ['empresa_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'empresas',
        name: 'PedidoEmpresa',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'pedidos',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'usuarios',
        name: 'PedidoUser',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pedidos');
  }
}
