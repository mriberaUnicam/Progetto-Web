var User        = require('../../../models/user');   // get our mongoose User model
var Q           = require('q');  // Q promise
var Reminder    = require('../../../models/reminder')

var db_utilities_user = this;
module.exports = db_utilities_user;
// esporto db_utilities così posso utilizzare i suoi metodi e attributi,
// come fosse una libreria


// =======================
// ERROR CODES
// =======================
// codici di errore di MongoDb
var ERR_DB_DUPLICATE_KEY = '11000';


/* ========================================
Esempio di User da passare come parametro
  { 
    'name':       name, 
    'password':   password,
    'admin':      true 
  }
*/

this.addUser = function(user)
{
 var deferred = Q.defer();
    
 // metto questo controllo sulla psw come esempio di utilizzo di deferred.reject
 // in realtà dovrei metterlo nello schema di Mongoose
 if (!user.password || user.password == "" || user.password.length<4)
      { deferred.reject('la password deve avere almeno 4 caratteri');  
        return deferred.promise;
      }
  if (!user.admin)
      { user.admin = false; }
    
  // crea un Utente, che deve rispettare lo schema definito con mongoose
  var nick = new User(user);

  // save the sample user
  nick.save()
             .then(function(user)
                {
                 console.log("Dovrebbe essere salvato");
                 logger.debug('utente salvato '+JSON.stringify(user));
                 /* eventuale invio email */
                 deferred.resolve(user);
                })
              .catch(function(err)
                 {
                  if (err.code == ERR_DB_DUPLICATE_KEY)
                      {deferred.reject({code:'ERR_DB_DUPLICATE_KEY', 
                                        msg:'questo utente esiste gia'}); }
                  else
                      {logger.error('[addUser] errore salvataggio utente '+err.errmsg);}
                  deferred.reject(err.errmsg);   
                 });
  return deferred.promise;
}

  this.getAllUser = function(){
    var utenti =  new User(user);

    utenti.find()
      .then(function(user){
        console.log(user);
        deferred.resolve(user);
      })
      .catch(function(){
        deferred.reject;
      })
  }

this.pushRem = function(reminder){
  var deferred = Q.defer();

  var rem = new Reminder(reminder);

  rem.save()
  .then(function(reminder)
  {
   console.log("Dovrebbe essere salvato");
   console.log('reminder salvato '+JSON.stringify(reminder));
   deferred.resolve(reminder);
  })
.catch(function(err)
   {
    if (err.code == ERR_DB_DUPLICATE_KEY)
        {deferred.reject({code:'ERR_DB_DUPLICATE_KEY', 
                          msg:'questo utente esiste gia'}); }
    else
        {logger.error('[pushRem] errore salvataggio utente '+err.errmsg);}
    deferred.reject(err.errmsg);   
   });
return deferred.promise;
}