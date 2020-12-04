const fs = require ('fs');
const { getMaxListeners } = require('process');
const crypto = require ('crypto');
const util = require('util');
const Repository = require ('./Repository');
const scrypt =util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
      async ComparePassword (saved,supplied) {
        // Saved -> password saved in database. "hashed.salt"
        // Supplied -> password given by a user tryin' sign in
        
        const [hashed,salt] = saved.split('.');
        const hashedsupplied = await scrypt(supplied,salt,64);
        return hashed === hashedsupplied.toString('hex');
      }
      // Creates a users with a given attributes
      async create (attrs) {
        //attrs ==== {email:"", password:""}
        
         attrs.id = this.randomId(); // creates and ataching random Id from randomId fn  
        // { email , password}

        // Creating Salt for password
        const salt = crypto.randomBytes(8).toString('hex');
          
        //Salt plus password that user provided inside the attrs object to generate Hashed Password
        const Hashed = await scrypt(attrs.password,salt,64,);

        const records = await this.getAll();
        const record = {
          ...attrs,
          password:`${Hashed.toString('hex')}.${salt}`
        }
        records.push(record);
        // write the updated 'records' array back to this.filename
        await this.writeAll(records);
        return record;
      }
     
        }
module.exports = new UsersRepository('users.json');