/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE TRIGGER "trg_update_collected_amount"
    AFTER INSERT ON "donations"
    FOR EACH ROW
    BEGIN
      IF :NEW."amount" IS NOT NULL AND :NEW."cause_id" IS NOT NULL THEN
        UPDATE "causes"
        SET "collected_amount" = NVL("collected_amount",0) + :NEW."amount"
        WHERE "cause_id" = :NEW."cause_id";
      END IF;
    END;
  `);
};

exports.down = async function(knex) {
  await knex.raw(`DROP TRIGGER "trg_update_collected_amount"`);
};

