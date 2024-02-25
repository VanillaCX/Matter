const { Schema, SchemaError, ShortText } = require("@VanillaCX/Schema")
const {QEditions} = require("../Queries")
const {Meta} = require("../Meta")

const metaSchema = new Schema({
    name: {type: ShortText, required: true},
});

const editionSchema = (model) => {
    return new Schema({
        id: {type: ShortText, required: true},
        meta: {schema: metaSchema, required: true},
        final: {schema: model.schema, required: true},
        draft: {schema: model.schema, required: true},
    })
}


class Edition {
    #schema;
    #modelSchema;
    #draft;
    #final;
    

    get draft(){
        return this.#draft;
    }

    get final(){
        return this.#final;
    }

    async updateDraft(draftFrag){

        const document = {
            ...this.#draft, ...draftFrag
        }

        const {valid, errors, sanitised} = this.#modelSchema.validate(document);

        if(!valid){
            throw new SchemaError(errors)
        }

        const filter = {id: this.id}
        const docFrag = {
            draft: sanitised
        }

        await QEditions.updateOne(filter, docFrag);

        this.#draft = sanitised;

        return this.draft

    }

    async approveDraft(){
        const document = {
            ...this.draft
        }

        const {
            valid,
            errors,
            sanitised
        } = this.#modelSchema.validate(document);

        if(!valid){
            throw new SchemaError(errors)
        }

        const filter = {
            id: this.id
        }

        const docFrag = {
            final: sanitised
        }

        await QEditions.updateOne(filter, docFrag);

        this.#final = sanitised;

        return this.final;

    }


    constructor({document, model}){
        console.log("constrcutor: model:", model)
        this.#schema = editionSchema(model);
        this.#modelSchema = model

        const {valid, errors, sanitised} = this.#schema.validate(document);

        if(!valid){
            throw new SchemaError(errors)
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

            await QEditions.updateOne(filter, saveDoc);
        }


        this.#draft = sanitised.draft;
        this.#final = sanitised.final;


    }
}

module.exports = {Edition}