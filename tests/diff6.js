

const isArray = (value) => {
    return Array.isArray(value)
 }

 const isObject = (value) => {
    return typeof value === 'object' && value !== null && value.constructor === Object
 }


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

/*main.push({
    title: "Lee Again"
})*/
console.log(main.reconstructed)

main.push({
    phones: {
        landline: {
            name: "Home Phones"
        }
    }
})

console.log(main.reconstructed)