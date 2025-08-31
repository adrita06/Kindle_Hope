/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// migrations/20250901_create_trigger_check_donation_goal.js

exports.up = async function(knex) {
  // Create or replace the trigger
  await knex.raw(`
    CREATE OR REPLACE TRIGGER "trg_check_goal"
    BEFORE INSERT ON "donations"
    FOR EACH ROW
    DECLARE
      "v_collected"  NUMBER;
      "v_goal"       NUMBER;
    BEGIN
     SELECT NVL("collected_amount",0), "goal_amount"
      INTO "v_collected", "v_goal"
      FROM "causes"
      WHERE "cause_id" = :NEW."cause_id"
      FOR UPDATE;

      -- Check if new donation exceeds goal
      IF :NEW."amount" + "v_collected" > "v_goal" THEN
        RAISE_APPLICATION_ERROR(-20001, 'Donation exceeds goal!');
      END IF;
    END;
  `);
};

exports.down = async function(knex) {
  //  drop the trigger
  await knex.raw(`EXECUTE IMMEDIATE 'DROP TRIGGER "trg_check_goal"';`);
};


