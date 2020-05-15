#!/bin/bash
sleep 10
until cqlsh cassandradb --request-timeout 5 -f /cassloader/db_drop.cql && cqlsh cassandradb --request-timeout 20 -f /cassloader/db.cql
do
  sleep 1
done
