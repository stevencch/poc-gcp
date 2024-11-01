/* Script to drop all schemas & tables from database */

DROP SCHEMA IF EXISTS store CASCADE;
DROP SCHEMA IF EXISTS marketplace CASCADE;
DROP TABLE IF EXISTS knex_migrations CASCADE;
DROP TABLE IF EXISTS knex_migrations_lock CASCADE;
