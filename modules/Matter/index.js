const { QMatter, QModels } = require("../Queries")
const { Model } = require("../Model")
const { Slots } = require("../Slots")
const { Editions } = require("../Editions")
const { Meta } = require("../Meta")

const {
    ShortText,
    Squid,
    Schema,
    SchemaError,
    Stamp,
} = require("@VanillaCX/SchemaCX")


const metaSchema = new Schema({
    name: {type: ShortText, required: true},
    model: {type: ShortText, required: true},
    created: {type: Stamp, required: true, default: Date.now()},
    author: {type: ShortText, required: true},
    defaultSlot: {type: ShortText, required: true, default: "production"}
});

class Matter {
    #saveMetaFN = () => {
        const tags = this.meta.list;
        const name = this.meta.tag("name");
        const model = this.meta.tag("model");

        const filter = {
            "meta.name": name,
            "meta.model": model,
        }

        const saveDoc = {
            meta: {
                ...tags
            }
        }

        QMatter.updateOne(filter, saveDoc);

    }
    
    static #schema = new Schema({
        id: {type: Squid, required: true},
        meta: {schema: metaSchema, required: true},
        slots: [{schema: Slots.schema}],
        editions: [{type: ShortText}],
    });

    constructor({id, meta, slots, editions, model} = {}){
        const {valid, errors, sanitised} = Matter.validateDoc({id, meta, slots, editions});

        if(!valid){
            throw new SchemaError(errors);
        }
        this.id = sanitised.id;

        this.meta = new Meta({
            schema: metaSchema,
            tags: sanitised.meta
        });

        this.meta.onUpdate = async () => {
            const tags = this.meta.list;
            const id = this.id;

            const filter = {id}

            const saveDoc = {
                meta: {
                    ...tags
                }
            }

            await QMatter.updateOne(filter, saveDoc);
        }
        

        this.model = model;

        this.editions = new Editions({
            matterID: this.id,
            model: this.model,
            editions: sanitised.editions
        });

        this.slots = new Slots(sanitised.slots);


    }

    static validateDoc(document){
        return this.#schema.validateDoc(document);
    }

    static async create({model, author, name = `New ${model}`}){
        const matterExists = await QMatter.exists({
            "meta.name": name,
            "meta.model": model
        });

        if(matterExists){
            throw new Error("MATTER_ALREADY_EXISTS")
        }

        const modelInstance = await Model.open(model)

        if(!modelInstance){
            throw new ReferenceError("MODEL_NOT_FOUND")
        }

        // Can create the Matter now.
        const document = {
            id: Squid.generate(),
            meta: {
                name,
                model,
                author,
                defaultSlot: "default"
            },
            slots: [{
                name: "default",
            }],
            editions: [],
        }

        const {
            valid,
            errors,
            sanitised
        } = Matter.validateDoc(document);

        if(!valid){
            throw new SchemaError(errors)
        }

        await QMatter.insertOne(sanitised);


        return new Matter({...sanitised, model: modelInstance});;
    }

    static async open({id, name, model} = {}){
        const matter = await QMatter.findOne({
            "meta.name": name,
            "meta.model": model
        })

        if(!matter){
            throw new ReferenceError("MATTER_NOT_FOUND")
        }

        const modelInstance = await Model.open(model)

        if(!modelInstance){
            throw new ReferenceError("MODEL_NOT_FOUND")
        }

        return new Matter({...matter, model: modelInstance});;
    }

    async fillSlot({name = this.meta.tag("defaultSlot"), edition} = {}){
        this.slots.fillSlot(name, edition);

        const filter = {id: this.id}

        const slots = this.slots.list;
        const saveDoc = {
            slots
        }

        await QMatter.updateOne(filter, saveDoc);
    }

    async openSlot(name = this.meta.tag("defaultSlot")){
        const slot = this.slots.find(name)
        
        if(!slot){
            throw new ReferenceError("NO_SUCH_SLOT")
        }

        const edition = slot.edition;

        if(!edition){
            throw new ReferenceError("EMPTY_SLOT")
        }


        return await this.editions.open(edition);
    }

    

    

    
}

module.exports = { Matter }