const {Schema, SchemaError, ShortText} = require("@VanillaCX/Schema");

class Slots {
    static #schema = new Schema({
        name: {type: ShortText, required: true},
        edition: {type: ShortText},
    });

    constructor(slots = []){
        this.array = slots;
        
    }

    get list(){
        return this.array;
    }

    static get schema(){
        return this.#schema;
    }

    create(name, edition){
        const exists = this.exists(name);

        if(exists){
            throw new Error("ALREADY_EXISTS")
        }

        const document = {
            name,
            edition
        };

        const {valid, errors, sanitised} = Slots.schema.validateDoc(document);

        if(!valid){
            throw new SchemaError(errors);
        }

        this.array.push(sanitised)
    }

    fillSlot(name, edition){
        let modified = false;

        this.array.forEach((slot, index, array) => {
            if(slot.name === name){
                array[index].edition = edition;
                modified = true;
            }
        })

        if(!modified){
            throw new ReferenceError("SLOT_DOESNT_EXIST")
        }

        return modified

    }

    remove(name){
        const exists = this.exists(name);

        if(!exists){
            throw new ReferenceError("SLOT_NOT_FOUND")
        }

        const slots = this.array.filter(slot => slot.name !== name);

        this.array = slots
    }

    exists(name){
        const slot = this.find(name);

        return (slot) ? true : false
    }

    find(name){
        return this.array.find(slot => slot.name === name)
    }
}

module.exports = {Slots}