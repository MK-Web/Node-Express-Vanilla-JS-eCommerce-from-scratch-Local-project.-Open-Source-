const fs = require ('fs');
const crypto = require ('crypto');

module.exports = class Repository {
    constructor(filename) {
        if (!filename) {
            throw new Error ('repository required');
        }

        this.filename = filename;
        try {
        fs.accessSync(this.filename);
        } catch (err){
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async create (attrs) {
        attrs.id = await this.randomId();
        
        const records = await this.getAll();
        records.push(attr);
        await this.writeAll(records);
        return attrs;
    }
  // Gets a list of all users
    async getAll() {
        
        return JSON.parse (
          await fs.promises.readFile(this.filename,{
              encoding:"utf8"
            })
            ); 
        }
          // Write all users to a users.json file
          async writeAll(records) {
            await fs.promises.writeFile(
                this.filename, 
                JSON.stringify(records, null,2)
                ); // second and third args are make json file more readble
          }

          // Generates random ID 
          randomId() {
            return crypto.randomBytes(4).toString('hex'); // use Crypto module and randomBytes() method to
                                                         // make 4 random ids and converts them toString in "hex" format
          }
          // Finds users with the given id
          async getOne(id) {
              const records = await this.getAll();
              return records.find(record => record.id === id); 
               
          }
          // Delete user with the given
            async delete(id) {
                const records = await this.getAll();
                const filteredRecords = records.filter(record => record.id !== id);
                await this.writeAll(filteredRecords);
            }

            // Updating 

            async update (id ,attrs) {
              const records = await this.getAll();
              const record = records.find(record => record.id ===id);

              if (!record) {
                throw new Error (`Record with this ${id} not found`);
              }
              Object.assign (record,attrs);
              await this.writeAll(records);
            }
            // FilterByOne

            async getOneBy (filters) {
              const records = await this.getAll();
              for (let record of records ) {
                let found = true;
                for (let key in filters){
                  if (record[key] !== filters[key]){
                    found = false;
                  }
                }
                if (found) {
                  return record;
                }
              }
            }
}