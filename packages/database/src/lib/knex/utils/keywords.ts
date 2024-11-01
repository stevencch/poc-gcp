export const MIGRATION_KEYWORDS = [
  // Schema operations
  'create schema',
  'drop schema',
  'alter schema',

  // Table operations
  'create table',
  'drop table',
  'alter table',
  'rename table',

  // Column operations
  'add column',
  'drop column',
  'alter column',
  'rename column',

  // Constraint operations
  'add constraint',
  'drop constraint',
  'alter constraint',
  'unique constraint',
  'primary key',
  'foreign key',

  // Index operations
  'create index',
  'drop index',
  'rename index',
  'create unique index',

  // View operations
  'create view',
  'drop view',
  'alter view',

  // Sequence operations
  'create sequence',
  'alter sequence',
  'drop sequence',

  // Trigger operations
  'create trigger',
  'drop trigger',
  'alter trigger',

  // Other DDL keywords
  'grant',
  'revoke',
  'comment on',
  'set',

  // Extension operations
  'create extension',
  'drop extension',
  'alter extension',
];

export const DML_KEYWORDS = [
  // Insert operations
  'insert into',
  'on conflict',
  'on conflict do nothing',
  'on conflict do update',
  'default values',

  // Update operations
  'update',
  'set',

  // Delete operations
  'delete from',

  // Truncate operations
  'truncate',

  // Common for insert/update/delete
  'returning',

  // Conditional clauses
  'where',
  'from',
  'using',

  // Returning data
  'returning',

  // Upsert operation
  'upsert',

  // Bulk insert operations
  'copy',
  'values',

  // Query modification operations
  'with',
  'with recursive',

  // Ordering, grouping, limiting operations
  'order by',
  'limit',
  'offset',
  'group by',
  'having',

  // Locking and conflict handling
  'for update',
  'for no key update',
  'for share',
  'for key share',

  // Additional options
  'on delete cascade',
  'on delete restrict',
  'on delete set null',
  'on delete set default',
  'on update cascade',
  'on update restrict',
  'on update set null',
  'on update set default',
];
