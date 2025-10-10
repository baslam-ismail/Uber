import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('drivers', (t) => {
        t.increments('id').primary();                 // auto-incrément
        t.string('name').notNullable();
        t.boolean('is_uberx').notNullable().defaultTo(false);   // capacité UberX
        t.boolean('is_on_road').notNullable().defaultTo(false); // dispo/en course
        t.timestamps(true, true);
    });

    await knex.schema.alterTable('drivers', (t) => {
        t.index(['is_uberx']);
        t.index(['is_on_road']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('drivers');
}
