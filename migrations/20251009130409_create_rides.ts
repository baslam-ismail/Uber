import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Enum Postgres pour le statut de ride
    await knex.raw(`DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ride_status') THEN
      CREATE TYPE ride_status AS ENUM ('PENDING','ASSIGNED','CANCELLED','COMPLETED');
    END IF;
  END$$;`);

    await knex.schema.createTable('rides', (t) => {
        t.increments('id').primary();                       // auto-incrément

        t.string('origin').notNullable();
        t.string('destination').notNullable();
        t.decimal('distance_km', 10, 2).notNullable().defaultTo(0);

        // Pricing en cents
        t.decimal('base_price', 12, 2).notNullable().defaultTo(0);
        t.decimal('km_price', 12, 2).notNullable().defaultTo(0);
        t.decimal('surcharge', 12, 2).notNullable().defaultTo(0);

        // Snapshot du type de course au moment de la réservation
        t.boolean('uberx').notNullable().defaultTo(false);

        // FKs vers entiers auto-incrémentés
        t.integer('rider_id').notNullable()
            .references('id').inTable('riders').onDelete('CASCADE');
        t.integer('driver_id').nullable()
            .references('id').inTable('drivers').onDelete('SET NULL');

        t.specificType('status', 'ride_status').notNullable().defaultTo('PENDING');

        t.timestamp('booked_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
        t.timestamp('cancelled_at', { useTz: false }).nullable();

        t.timestamps(true, true);
    });

    await knex.schema.alterTable('rides', (t) => {
        t.check('base_price >= 0');
        t.check('km_price >= 0');
        t.check('surcharge >= 0');
        t.index(['rider_id']);
        t.index(['driver_id']);
        t.index(['status']);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('rides');
    await knex.raw('DROP TYPE IF EXISTS ride_status;');
}
