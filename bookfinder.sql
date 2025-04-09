\echo 'Delete and recreate bookfinder db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS bookfinder;
CREATE DATABASE bookfinder;
\connect bookfinder

\i bookfinder-schema.sql
\i bookfinder-seed.sql

\echo 'Delete and recreate bookfinder_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS bookfinder_test;
CREATE DATABASE bookfinder_test;
\connect bookfinder_test

\i bookfinder-schema.sql
\i bookfinder-seed.sql
