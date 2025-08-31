/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE TRIGGER "trg_remove_recurring_donations"
    AFTER UPDATE OF "collected_amount" ON "causes"
    FOR EACH ROW
    WHEN (NEW."collected_amount" = NEW."goal_amount")
    BEGIN
      DELETE FROM "donation_schedule"
      WHERE "cause_id" = :NEW."cause_id";
    END;
  `);
};

exports.down = async function(knex) {
  await knex.raw(`
    BEGIN
      EXECUTE IMMEDIATE 'DROP TRIGGER "trg_remove_recurring_donations"';
    EXCEPTION
      WHEN OTHERS THEN
        IF SQLCODE != -4080 THEN
          RAISE;
        END IF;
    END;
  `);
};
