const { Pool } = require('pg')

describe("Integration Tests", () => {
  test("Database operation", async () => {
    const pool = new Pool({
      connectionString: process.env.DB_CONNETION_STRING,
      port: 5432,
    })

    try {
      const res = await pool.query("SELECT 1");
      expect(res.rows[0]["?column?"]).toBe(1)
    } catch (error) {
      expect(error).toBeNull()
    }
    await pool.end()
  });
})
