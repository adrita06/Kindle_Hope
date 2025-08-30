/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.raw(`
    CREATE OR REPLACE PROCEDURE process_recurring_donations IS
      CURSOR donation_cursor IS
        SELECT "schedule_id",
               "amount",
               "next_payment_date",
               "end_date",
               "frequency",
               "user_id",
               "cause_id"
        FROM "donation_schedule"
        WHERE TRUNC("next_payment_date") = TRUNC(SYSDATE);

      v_donation donation_cursor%ROWTYPE;
      v_next_date DATE;
    BEGIN
      OPEN donation_cursor;
      LOOP
        FETCH donation_cursor INTO v_donation;
        EXIT WHEN donation_cursor%NOTFOUND;

        INSERT INTO "donations" (
          "amount",
          "donation_date",
          "recurring_flag",
          "anonymous_flag",
          "user_id",
          "cause_id"
        ) VALUES (
          v_donation."amount",
          SYSDATE,
          1,
          0,
          v_donation."user_id",
          v_donation."cause_id"
        );

        IF v_donation."frequency" = 'daily' THEN
          v_next_date := v_donation."next_payment_date" + 1;
        ELSIF v_donation."frequency" = 'weekly' THEN
          v_next_date := v_donation."next_payment_date" + 7;
        ELSIF v_donation."frequency" = 'monthly' THEN
          v_next_date := ADD_MONTHS(v_donation."next_payment_date", 1);
        ELSIF v_donation."frequency" = 'yearly' THEN
          v_next_date := ADD_MONTHS(v_donation."next_payment_date", 12);
        END IF;

        UPDATE "donation_schedule"
        SET "next_payment_date" = v_next_date
        WHERE "schedule_id" = v_donation."schedule_id";

        IF v_donation."end_date" IS NOT NULL
          AND TRUNC(v_next_date) > TRUNC(v_donation."end_date") THEN
          DELETE FROM "donation_schedule"
          WHERE "schedule_id" = v_donation."schedule_id";
        END IF;

      END LOOP;
      CLOSE donation_cursor;

      COMMIT;
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.raw(`DROP PROCEDURE process_recurring_donations`);
};
