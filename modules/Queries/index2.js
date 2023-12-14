const { Query } = require("@VanillaCX/Query");

const account = process.env.SESSION_USER_ID;
const database = process.env.MATTER_DATABASE;

const modelcollection = `${account}-models`;
const editionscollection = `${account}-editions`;
const mattercollection = `${account}-matter`;

class Client extends Query {
    constructor({database, collection} = {}){
        super({database, collection})
    }

    //exists(filter) [INHERITED]
    async save(filter, document){
        return await this.updateOne(filter, document)
    }

    async open(filter){
        return await this.findOne(filter)
    }

    async create(document){
        return await this.insertOne(document);
    }

    async saveMeta(filter, tags){
        return await this.save(filter, {
            meta: tags
        })
    }

    async saveMeta(filter, slots){
        return await this.save(filter, {
            slots: slots
        })
    }
}

const QModels = new Client({
    database,
    collection: modelcollection
});

const QEditions = new Client({
    database,
    collection: editionscollection
});

const QMatter = new Client({
    database,
    collection: mattercollection
});

module.exports = {QModels, QEditions, QMatter}