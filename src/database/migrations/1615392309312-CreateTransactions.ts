import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactions1615392309312
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
          },
          // {
          //   name: 'category_id',
          //   type: 'uuid',
          // },
          {
            name: 'created_at',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'date',
            default: 'now()',
          },
        ],
        // foreignKeys: [
        //   {
        //     name: 'FKCategory',
        //     referencedTableName: 'categories',
        //     referencedColumnNames: ['id'],
        //     columnNames: ['category_id'],
        //     onDelete: 'CASCADE',
        //     onUpdate: 'CASCADE',
        //   },
        // ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
