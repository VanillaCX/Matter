const {Squid, SchemaError} = require("@VanillaCX/SchemaCX");
const {QEditions, QMatter} = require("../Queries")
const {Edition} = require("../Edition")

class Editions {
    constructor({matterID, model, editions = []} = {}){
        this.array = editions;
        this.model = model;
        this.matterID = matterID
    }

    async open(id) {
        const document = await QEditions.findOne({id});

        if(!document){
            return new Error("ERROR_OPENING_EDITION")
        }

        return new Edition({
            document,
            model: this.model
        })

    }

    get list(){
        return this.array
    }

    async create({document, name = "New Edition", id = Squid.generate()} = {}){
        const {valid, errors, sanitised} = this.model.validateDoc(document);

        if(!valid){
            throw new SchemaError(errors)
        }

        const editionDoc = {
            id,
            meta: {
                name
            },
            final: sanitised,
            draft: sanitised,
        }

        const editionInstance = new Edition({
            document: editionDoc,
            model: this.model
        })

        await QEditions.insertOne(editionDoc);

        this.array.push(id);

        const filter = {id: this.matterID}

        const docFrag = {
            editions: this.array
        }

        await QMatter.updateOne(filter, docFrag);

        return editionInstance
    }
}


module.exports = { Editions }