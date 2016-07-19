var mongodb = require('./mongodb');
var mongoose = mongodb.mongoose;
var Schema = mongoose.Schema;
var AccountSchema = new Schema({
    name : String,
    pwd : String,
    create_date : { type: Date, default: Date.now }
  },{
    collection: 'account'
});
var AccountModel = mongoose.model("account", AccountSchema);

module.exports = AccountModel;
