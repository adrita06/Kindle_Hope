/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Drop the procedure if it exists
 return knex.raw(`
    BEGIN
      EXECUTE IMMEDIATE 'DROP PROCEDURE process_recurring_donations';
    EXCEPTION
      WHEN OTHERS THEN
        IF SQLCODE != -4043 THEN
          RAISE;
        END IF;
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // You could recreate it here if needed, or leave it blank
  return knex.raw(`BEGIN NULL; END;`);
};
