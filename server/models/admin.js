import pool from '../utils/db.js';

export async function insertFunction(functionInfo) {
  const result = pool.query(
    `INSERT INTO \`functions\`(
      \`name\`, \`type\`, \`description\`, 
      \`template_input\`, \`template_output\`, \`external_name\`)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      functionInfo.name,
      functionInfo.type,
      functionInfo.description,
      functionInfo.template_input,
      functionInfo.template_output,
      functionInfo.external_name,
    ]
  );
  return result.insertId;
}
