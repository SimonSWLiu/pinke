var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/pinke',function(err){
  if(err) throw err;
});

mongoose.connection.on('on',function(){
  console.log(mongoose.connection.collection);
  mongoose.connection.db.collectionNames(function(err,name){
    console.log(name);
  })
});

exports.mongoose = mongoose;
