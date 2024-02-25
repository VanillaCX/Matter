const { QModels } = require("../Queries")

const {
    Schema,
} = require("@VanillaCX/Schema")

class Model {
    #schema;
    id;
    constructor({id, schema} = {}){
        this.id = id;
        const parsedSchema = Schema.parse(schema);
        this.#schema = new Schema(parsedSchema)
    }

    get schema(){
        return this.#schema
    }

    validate(document){
        const {valid, errors, sanitised} = this.schema.validate(document);

        return {valid, errors, sanitised};
    }

    static async create({id, schema} = {}){
        const modelExists = await QModels.exists({id});

        if(modelExists){
            throw new Error("MODEL_EXISTS")
        }

        const result = await QModels.insertOne({
            id,
            schema: schema.stringified
        })

        return result;
    }
    

    static async open(id) {
        const model = await QModels.findOne({id: id});

        if(!model){
            throw new ReferenceError("MODEL")
        }

        return new Model(model);
    }
}

module.exports = { Model }