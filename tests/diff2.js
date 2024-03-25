

const isArray = (value) => {
    return Array.isArray(value)
 }

 const isObject = (value) => {
    return typeof value === 'object' && value !== null && value.constructor === Object
 }


class Branch {
    #schema;
    #map;
    constructor({schema, versions = []} = {}){
        this.#schema = schema;
        this.#map = this.#buildMap({...this.schema})
        this.versions = versions
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
        console.log("LOOK FOR ", path);

        for (const version of this.versions) {
            console.log("\n\n\n\t\t", version)
        }

        return "FIND_ME"
    }

    #buildTree({schema = {}, path = []} = {}){
        const tree = {}
        
        // Go through each of properties ...
        Object.entries(schema).forEach(([key, value]) => {

            if (isObject(value)) {
                tree[key] = this.#buildTree({schema: value, path: [...path, key]})
            } else {
                tree[key] = this.#getLatestProperty([...path, key])
            }

        })

        return tree

    }
    


    build(){
        const map = this.#buildMap({...this.schema})
        const tree = this.#buildTree({schema: map})
        console.log("\n\nmap:", map)
        console.log("\n\ntree:", tree)


    }

    push(data){
        this.versions.unshift(data)
        const build = this.build()
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
            firstname: "Lee BO",
            avatar: {
                alt: "My chops"
            }
        },
        {
            age: "45",
        },
        {
            firstname: "lee",
        },
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
        },
    ]
})

/*main.push({
    title: "Lee Again"
})*/

main.push({
    phones: {
        landline: {
            name: "Home Phone"
        }
    }
})