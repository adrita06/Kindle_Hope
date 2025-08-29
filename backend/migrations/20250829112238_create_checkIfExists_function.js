/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return knex.raw(`
    CREATE OR REPLACE FUNCTION checkIfExists (
      p_user_id  IN "donation_schedule"."user_id"%TYPE,
      p_cause_id IN "donation_schedule"."cause_id"%TYPE
    ) RETURN NUMBER
    IS
      cnt NUMBER;
    BEGIN
      SELECT COUNT(*)
      INTO cnt
      FROM "donation_schedule" d
      WHERE d."user_id" = p_user_id
        AND d."cause_id" = p_cause_id;

      IF cnt > 0 THEN
        RETURN 1;
      ELSE
        RETURN 0; 
      END IF;
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.raw(`DROP FUNCTION checkIfExists`);
};
