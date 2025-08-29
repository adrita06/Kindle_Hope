/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.raw(`
    CREATE OR REPLACE TRIGGER trg_recurring_donation_history
    BEFORE DELETE ON "donation_schedule"
    FOR EACH ROW
    BEGIN
      INSERT INTO "recurring_donation_history"(schedule_id, user_id, cause_id, amount, start_date, end_date)
      VALUES (:OLD.schedule_id, :OLD.user_id, :OLD.cause_id, :OLD.amount, :OLD.start_date, SYSDATE);
    END;
  `);
};

exports.down = async function(knex) {
  return knex.raw(`DROP TRIGGER trg_recurring_donation_history`);
};
