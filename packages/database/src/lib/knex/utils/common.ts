export function addSqlTerminator(sql: string): string {
  if (!sql.endsWith(';')) {
    sql += ';';
  }

  return sql;
}
