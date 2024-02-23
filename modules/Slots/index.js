const { QMatter } = require("../Queries")

const {Schema, SchemaError, ShortText} = require("@VanillaCX/Schema");

class Slots {
    static #schema = new Schema([{
        name: {type: ShortText, required: true},
        edition: {type: ShortText},
    }]);

    constructor({id, slots = [], defaultSlot} = {}){
        this.array = slots;
        this.defaultSlot = defaultSlot;
        this.id = id
    }

    static async open (id){
        const matter = await QMatter.findOne({id})

        if(!matter){
            throw new ReferenceError("MATTER_NOT_FOUND")
        }

        return new Slots({id, defaultSlot: matter.meta.defaultSlot, slots: matter.slots});
    }

    static get schema(){
        return this.#schema;
    }

    get list(){
        return this.array;
    }

    async #saveSlots(){
        const filter = {id: this.id}

        const docFrag = {
            slots: this.array
        }

        return await QMatter.updateOne(filter, docFrag);

    }

    async create(name, edition = ""){
        const exists = this.exists(name);

        if(exists){
            throw new Error("ALREADY_EXISTS")
        }

        const document = {
            name,
            edition
        };

        const {valid, errors, sanitised} = Slots.schema.validate(document);

        if(!valid){
            throw new SchemaError(errors);
        }

        this.array.push(sanitised)

        return await this.#saveSlots()
    }

    async fill({edition, slot = this.defaultSlot} = {}){

        const partialDoc = [{edition, name: slot}]

        const {valid, errors, sanitised} = Slots.schema.validatePartial(partialDoc);

        if(!valid){
            throw new SchemaError(errors);
        }

        let modified = false;

        this.array.forEach((_slot, index, array) => {
            if(_slot.name === slot){
                array[index].edition = sanitised[0].edition;
                modified = true;
            }
        })

        if(!modified){
            throw new ReferenceError("SLOT_DOESNT_EXIST")
        }

         return await this.#saveSlots()

    }

    async remove(slot){
        const exists = this.exists(slot);

        if(!exists){
            throw new ReferenceError("SLOT_NOT_FOUND")
        }

        const new_slots = this.array.filter(_slot => _slot.name !== slot);

        this.array = new_slots

        return await this.#saveSlots()
    }



    exists(slot){
        const _slot = this.get(slot);

        return (_slot) ? true : false
    }

    get(slot){
        return this.array.find(_slot => _slot.name === slot)
    }
}

module.exports = {Slots}