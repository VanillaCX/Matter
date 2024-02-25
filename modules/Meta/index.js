const {Schema, SchemaError, ShortText, Stamp} = require("@VanillaCX/Schema");

class Meta {
    #schema;
    #tags;
    #onUpdate;

    constructor({schema, tags} = {}){
        this.#schema = (schema instanceof Schema) ? schema : new Schema(schema);

        const {valid, errors, sanitised} = this.#schema.validate(tags);

        if(!valid){
            throw new SchemaError(errors);
        }

        this.#tags = sanitised;

    }

    set onUpdate(callback){
        this.#onUpdate = callback
    }

    tag(key, value){

        if(value){
            this.#set({[key]: value})
        }

        return this.#tags[key]
    }

    #set(docFrag){
        const {valid, errors, sanitised} = this.#schema.validatePartial(docFrag);
        
        if(!valid){
            throw new SchemaError(errors);
        }

        const saveDoc = {
            meta: {
                ...this.#tags, ...sanitised
            }
        }

        this.#tags = saveDoc.meta;

        this.#onUpdate(this.list);

    }

    get list(){
        return this.#tags;
    }

    get schema(){
        return this.#schema;
    }

    
}

module.exports = {Meta}