const { ShortText, DataTypes } = require("@VanillaCX/Schema")
const {Schema} = require("@VanillaCX/Schema")


/**

class Branch {
    #schema;
    #map;
    #reconstructed

    constructor({schema, versions = []} = {}){
        this.#schema = schema;
        this.#map = this.#buildMap({...this.schema})
        this.versions = versions.reverse()

        this.reconstruct()
    }

    get reconstructed(){
        return this.#reconstructed
    }

    get map(){
        return this.#map
    }

    get schema(){
        return this.#schema
    }

    #buildMap(schema){
        const map = {}
        Object.entries(schema).forEach(([key, value]) => {
            if (isObject(value)) {
                map[key] = this.#buildMap(value)
            } else {
                map[key] = false
            }

        })

        return map
    }

    #getLatestProperty(path){
        let value = false
        let latestvalue = false;

        for (const version of this.versions) {
            const value = path.reduce((acc, key) => {
                return (acc && acc[key]) ? acc[key] : false
            }, version);
            
            if (value && !latestvalue) {
                latestvalue = value
                break
            }
        }

        return latestvalue
    }

    #reconstruct({schema = this.map, path = []} = {}){
        const tree = {}
        
        // Go through each of properties ...
        Object.entries(schema).forEach(([key, value]) => {

            if (isObject(value)) {
                tree[key] = this.#reconstruct({schema: value, path: [...path, key]})
            } else {
                tree[key] = this.#getLatestProperty([...path, key])
            }

        })

        return this.#reconstructed = tree

    }
    


    reconstruct(){
        return this.#reconstruct()
    }

    push(data){
        // Push should NOT need to rebuild tree. Just needs to merge into last build
        this.versions.unshift(data)

        return this.reconstruct()
    }
}


const main = new Branch({
    schema: {
        firstname: "",
        secondname: "",
        age:"",
        avatar: {
            url: "",
            alt: ""
        },
        phones: {
            mobile: {
                name: "",
                country: "",
                dialcode: "",
                number: ""
            },
            landline: {
                name: "",
                country: "",
                dialcode: "",
                number: ""
            }
        }
    },
    versions: [
        {
            firstname: "john",
            secondname: "bowyer",
            age:"44",
            avatar: {
                url: "http://www.google.com",
                alt: "My Face"
            },
            phones: {
                mobile: {
                    name: "Oppo",
                    country: "france",
                    dialcode: "66",
                    number: "0000000000"
                },
                landline: {
                    name: "Home",
                    country: "france",
                    dialcode: "66",
                    number: "0000000000"
                }
            }
        },{
            firstname: "lee",
        },{
            age: "45",
        },{
            firstname: "Lee BO",
            avatar: {
                alt: "My chops"
            }
        }
    ]
})

main.push({
    title: "Lee Again"
})
console.log(main.reconstructed)

main.push({
    phones: {
        landline: {
            name: "Home Phones"
        }
    }
})

console.log(main.reconstructed) */


const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const isSchema = (value) => {
    return value.schema && value.schema.name === "Schema"
}

const isObject = (value) => {
   return typeof value === 'object' && value !== null && value.constructor === Object
}

const isRule = (value) => {
   return value.type && value.type.name && DataTypes[value.type.name]
   
}

const isJsonObject = (value) => {
   return isObject(value) && !isRule(value)
}

const isArray = (value) => {
   return Array.isArray(value)
}

/**
 * ITERATIONS CLASS
 */
    class VersionControl {
        #iterations;
        #map;
        #latest;
        #preview;
        #draft;

        constructor({draft: {}, iterations = [], schema} = {}){
            this.#iterations = iterations
            this.#map = this.#buildMapFromSchemaDefinition(schema.definition)
            this.#latest = this.#buildLatest()
            this.draft = draft

        }

        #buildLatest(){
            return this.#traverseIterations()
        }

        #buildPreview(){
            return this.#traverseIterations()
        }

        get preview(){
            return this.#preview
        }

        get latest(){
            return this.#latest
        }

        set draft(value){
            this.#draft = value

            this.#preview = this.#traverseIterations({includeDraft: true})
        }

        get draft(){
            return this.#draft
        }

        get map(){
            return this.#map
        }


        #buildMapFromSchemaDefinition(schema){
            const map = {}
            Object.entries(schema).forEach(([key, value]) => {
                if (isRule(value)) {
                    map[key] = false
                } else if (isSchema(value)) {
                    map[key] = this.#buildMapFromSchemaDefinition(value.schema.definition)
                } 
            })
    
            return map
        }

        #latestValueAtPath(path, includeDraft = false){
            let value = false
            const iterations = [...this.#iterations]

            if (includeDraft) {
                iterations.unshift(this.draft)
            }
    
            for (const iteration of iterations) {
                path.reduce((acc, key) => {
                    if (!value && acc && acc[key]) {
                        value = acc[key]
                    }

                    return (acc && acc[key]) ? acc[key] : false
                }, iteration);
               
                if (value) {
                    break
                }

            }
            return value
        }
    
        #traverseIterations({schema = this.map, path = [], includeDraft = false} = {}){
            const tree = {}
            
            // Go through each of properties ...
            Object.entries(schema).forEach(([key, value]) => {
    
                if (isObject(value)) {
                    tree[key] = this.#traverseIterations({schema: value, path: [...path, key], includeDraft})
                } else {
                    tree[key] = this.#latestValueAtPath([...path, key], includeDraft)
                }
    
            })
    
            return tree
    
        }

    }


class TempQuery {
    constructor(){

    }

    findOne(id = "") {
        if (id == "project") {
            return {
                "id" : "project",
                "schema" : "{\"sub\": {"\"name\":{\"type\":\"ShortText\",\"required\":true},\"title\":{\"type\":\"ShortText\",\"required\":true},\"subtitle\":{\"type\":\"ShortText\",\"required\":true},\"description\":{\"type\":\"LongText\",\"required\":true}}"}},\"name\":{\"type\":\"ShortText\",\"required\":true},\"title\":{\"type\":\"ShortText\",\"required\":true},\"subtitle\":{\"type\":\"ShortText\",\"required\":true},\"description\":{\"type\":\"LongText\",\"required\":true}}"
            }
        }
    }
}

const QModels = new TempQuery()


/**
 * MODEL CLASS
 */

    class Model {
        constructor({schema}){
            console.log("schemaschemaschemaschema:", Schema.parse(schema));
        }

        static open(id) {
            const {schema} = QModels.findOne(id)

            return new Model({schema})
        }
    }

/**
 * MATTER CLASS
 */
    class Matter {
        #iterations;
        #schema;
        #meta

        constructor({meta = {}, iterations = [], draft = {}, schema, model} = {}){
            this.#meta = meta
            this.versioning = new VersionControl({draft, iterations, schema})
            this.schema = new Schema(schema)
            this.model = Model.open(model)

        }
    }




/**
 * LOAD DATA FROM MONGO
 */
    const meta = {
        name: "Paul",
        model: "artwork",
        created: 1708604217879,
        author: "me"
    }

    const iterations = [{
        title: "Paul",
        subtitle: "watercolour",
        description: "This is my painting"
    },{
        title: "Paul McCartney",
    }]

    const subSchema = new Schema({
        day: {type: ShortText},
        month: {type: ShortText},
        year: {type: ShortText},
    })

    const schema = new Schema({
        title: {type: ShortText},
        subtitle: {type: ShortText},
        description: {type: ShortText},
        dob: {schema: subSchema}
    })

    const draft = {
        title: "JOHN"
    }
/**
 * END
 */

const dummySchemaFromDataBase = schema.stringified

/**
 * CREATE MATTER
 */
    const paul = new Matter({
        meta: meta,
        iterations: iterations,
        schema: schema,
        draft: draft,
        model: "project"
    })


console.log("paul.schema:", paul.schema)
console.log("paul.versioning.map:", paul.versioning.map)
console.log("paul.versioning.latest:", paul.versioning.latest)
console.log("paul.versioning.draft:", paul.versioning.draft)
console.log("paul.versioning.preview:", paul.versioning.preview)
