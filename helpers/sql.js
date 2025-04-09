/** Helper function to create SQL string and values for partial updates. */
function sqlForPartialUpdate(data, jsToSql) {
  const columns = Object.keys(data);
  if (columns.length === 0) {
    throw new Error("No data");
  }

  const setCols = columns
    .map((col, idx) => `"${jsToSql[col] || col}" = $${idx + 1}`)
    .join(", ");
  const values = Object.values(data);

  return {
    setCols,
    values,
  };
}

module.exports = { sqlForPartialUpdate };
