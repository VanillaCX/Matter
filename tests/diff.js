console.log("YO");

const isArray = (value) => {
    return Array.isArray(value)
 }

 const isObject = (value) => {
    return typeof value === 'object' && value !== null && value.constructor === Object
 }


const matter = {
    title: "Lee Craigie",
    subtitle: "Bowyer",
    image: {
        url: "http://www.google.com",
        alt: "its a picture"
    }
}

const pseudoMatter = {
    title: "lee",
    subtitle: "Bowyer",
    image: {
        url: "http://www.google.com",
        alt: "its a pictures"
    }
}

class Matter{
    constructor(){
        this.darkMatter = new this.darkMatter()
        this.differentialMatter = new DifferentialMatter()
        
    }


}

class DifferentialMatter{
    #matter;

    constructor(){
        this.#matter = {}
    }

    get matter(){
        return this.#matter
    }

    #traverse(matter, pseudoMatter){
        const diffMatter = {}

        Object.entries(matter).forEach(([key, matterValue]) => {
            const pseudoMatterValue = pseudoMatter[key];

            if (isObject(matterValue)) {
                console.log(key, " is an OBJECT:", matterValue);
                diffMatter[key] = this.#traverse(matterValue, pseudoMatterValue)
            } else {

            if (matterValue !== pseudoMatterValue) {
                console.log(`${key} has changed`)
                diffMatter[key] = matterValue
            } 
            }
            

        })

        return diffMatter
    }

    create(matter, pseudoMatter){
        return this.#matter = this.#traverse(matter, pseudoMatter)
    }
}

const differentialMatter = new DifferentialMatter()


differentialMatter.create(matter, pseudoMatter)

console.log("Differential Matter: \n", differentialMatter.matter);