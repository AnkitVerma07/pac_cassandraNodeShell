const config = require('../../config/config');
const ExpressCassandra = require('express-cassandra');
console.log(config.get('cassandra'))
const models = ExpressCassandra.createClient({
  clientOptions: {
    contactPoints: config.get('cassandra').contactPoints,
    protocolOptions:  config.get('cassandra').protocolOptions,
    keyspace: config.get('cassandra').keyspace,
    queryOptions: {consistency: ExpressCassandra.consistencies.one}
  },
  ormOptions: {
    defaultReplicationStrategy : {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
  }
});

const Users = models.loadSchema('users', {
  fields:{
    id : {
      type: "uuid",
      default: {"$db_function": "uuid()"}
    },
    first_name    : { type: "varchar", default: null},
    last_name : { type: "varchar", default: null},
    email     : { type: "varchar", default: null},
    createdAt : {
      type: "timestamp",
      default: {"$db_function": "toTimestamp(now())"}
    },
    updatedAt : {
      type: "timestamp"
    }
  },
  key:["id"]
});

// MyModel or models.instance.users can now be used as the model instance
console.log(models.instance.users === Users);

// sync the schema definition with the cassandra database table
// if the schema has not changed, the callback will fire immediately
// otherwise express-cassandra will try to migrate the schema and fire the callback afterwards
Users.syncDB(function(err, result) {
  if (err) throw err;
  // result == true if any database schema was updated
  // result == false if no schema change was detected in your models
});

module.exports = Users;