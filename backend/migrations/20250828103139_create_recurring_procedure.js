/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// migrations/20250828_create_recurring_procedure.js
exports.up = async function(knex) {
  return knex.raw(`
    CREATE OR REPLACE PROCEDURE process_recurring_donations AS
      CURSOR donation_cursor IS
        SELECT * FROM "donation_schedule"
        WHERE TRUNC(next_payment_date) = TRUNC(SYSDATE);
      v_next_date DATE;
    BEGIN
      FOR donation IN donation_cursor LOOP
        INSERT INTO donations(amount, donation_date, recurring_flag, user_id, cause_id)
        VALUES (donation.amount, SYSDATE, 'true', donation.user_id, donation.cause_id);

        -- Update next payment date
        IF donation.frequency = 'daily' THEN
          v_next_date := donation.next_payment_date + 1;
        ELSIF donation.frequency = 'weekly' THEN
          v_next_date := donation.next_payment_date + 7;
        ELSIF donation.frequency = 'monthly' THEN
          v_next_date := ADD_MONTHS(donation.next_payment_date, 1);
        END IF;

        UPDATE "donation_schedule"
        SET next_payment_date = v_next_date
        WHERE schedule_id = donation.schedule_id;

        IF donation.end_date = SYSDATE THEN
          DELETE FROM "donation_schedule"
          WHERE schedule_id = donation.schedule_id;
        END IF;
      END LOOP;

      COMMIT;
    END;
  `);
};

exports.down = async function(knex) {
  return knex.raw(`DROP PROCEDURE process_recurring_donations`);
};
