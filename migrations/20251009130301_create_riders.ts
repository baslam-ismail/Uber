import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('riders', (t) => {
        t.increments('id').primary();                 // auto-incrément
        t.string('name').notNullable();
        t.bigInteger('balance_cents').notNullable().defaultTo(0);
        t.date('birth_date').notNullable();
        t.timestamps(true, true);
    });

    await knex.schema.alterTable('riders', (t) => {
        t.check('balance_cents >= 0');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('riders');
}
