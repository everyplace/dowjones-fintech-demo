/*
* Mongo Model using mongodb-native-client
*/

if(process.env.MONGOLAB_URI) {

  var MongoClient = require('mongodb').MongoClient;
  var collectionName = (process.env.MONGOLAB_DB) ? process.env.MONGOLAB_DB : 'users';
  console.log("MONGODB: connection established");

} else {
  console.log("MONGODB: api keys not configured for this environment");
};



exports.insert = function(data, options, callback) {

  if(typeof options === "object") {
    callback = (typeof callback === "function") ? callback : null;
    if("collectionName" in options) {
      var collectionName = options.collectionName;
    }    
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  } else {
    callback = options = null;
  }

  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    // console.log("inserting");
    if(err) {
      callback(err, null);
    } else {
      var collection = db.collection(collectionName).insert(data, function(err, response){
        db.close();
       
        (process.env.DEBUG=='true') ? console.log(response) : null;
        if(callback) {
          callback(err, response);
        }
      });        
    }
  });  
};

exports.update = function(query, data, options, callback) {
  if(typeof options === "object") {
    callback = (typeof callback === "function") ? callback : null;
    if("collectionName" in options) {
      var collectionName = options.collectionName;
    }    
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  } else {
    callback = options = null;
  }

  (process.env.DEBUG=='true') ? console.log("updating using query:", query) : null;
  (process.env.DEBUG=='true') ? console.log("collectionName:", collectionName) : null;
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
      (process.env.DEBUG=='true') ? console.log("err:", err) : null;
      var collection = db.collection(collectionName);

      collection.update(query, data, null, function(err, response){
        db.close();
        (process.env.DEBUG=='true') ? console.log("running update callback:", query) : null;
        callback(err, response);
      });
  });   
};

exports.find = function(data, options, callback) {
  if(typeof options === "object") {
    callback = (typeof callback === "function") ? callback : null;
    if("collectionName" in options) {
      var collectionName = options.collectionName;
    }
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  } else {
    callback = options = null;
  }
  (process.env.DEBUG=='true') ? console.log("finding using query:", data) : null;
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    
      if(err) {
        callback(err);
      } else {
        var options = {};

        db.collection(collectionName).find(data, options).toArray(function(err, docs){
          db.close();

          callback(err, docs);
        });
      }

  });  
};

exports.findLatest = function(data, options, callback){


  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    
      if(err) {
        callback(err);
      } else {

        if(!options.limit){
          options.limit = 10
        }
        
        db.collection(options.collectionName)
          .find(data).sort({_id:1}).limit(options.limit)
            .toArray(function(err, docs){

              db.close();

              callback(err, docs);
            });
      }
  });
}

exports.findOne = function(data, options, callback) {
  //maybe I care about having an optional options object
  if(typeof options === "object") {
    callback = (typeof callback === "function") ? callback : null;
    if("collectionName" in options) {
      var collectionName = options.collectionName;
    }
  } else if (typeof options === "function") {
    callback = options;
    options = null;
  } else {
    callback = options = null;
  }

  if(process.env.DEBUG=='true'){
    console.log("findOne query:", data);  
  }
  
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    
      if(err) {
        callback(err);
      } else {
        db.collection(collectionName).findOne(data, function(err, response){
          db.close();
          callback(err, response);
        });  
      }
      
  });  
};
