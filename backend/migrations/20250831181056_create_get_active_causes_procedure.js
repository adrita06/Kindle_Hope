/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    CREATE OR REPLACE PROCEDURE "get_active_causes" (
      "p_result" OUT SYS_REFCURSOR
    )
    AS
    BEGIN
      OPEN "p_result" FOR
        SELECT "cause_id",
               "title",
               "description",
               "goal_amount",
               "collected_amount"
        FROM "causes"
        WHERE NVL("collected_amount", 0) < "goal_amount";
    END;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`DROP PROCEDURE "get_active_causes"`);
};
