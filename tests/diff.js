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


class Edition {
    #differentialMatter;

    constructor(){
        this.#differentialMatter = {}
    }

    get differentialMatter(){
        return this.#differentialMatter
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

    generateDifferentialMatter(matter, pseudoMatter){
        return this.#differentialMatter = this.#traverse(matter, pseudoMatter)
    }
}

const edition = new Edition()


edition.generateDifferentialMatter(matter, pseudoMatter)

console.log("Differential Matter: \n", edition.differentialMatter);


const matter = {
    "dark-matter": {
        "name" : "clouds",
		"model" : "artwork",
		"created" : 1708604217879,
		"author" : "lee001",
		"defaultSlot" : "production"
    },
    "realms": [{
        "name": "general-public",
        "visible-matter": "aa2f85a4f65645f7a43127c024e00661"
    },{
        "name": "specialised",
        "visible-matter": "bca8610e5fc9456986719d2b935c83fe"
    }],


    "visible-matter": [
        "abae90abe5ea46379eda4bd2ccf9230f",
		"bca8610e5fc9456986719d2b935c83fe",
		"533bb15119464a43af41cebe591274ef",
		"781373769a59494c949517366105a3c6",
		"04120cdd0ab44a38981ae81c40b2fec5",
		"a7b6fa02a88044f581306d61272ea3ad",
		"0ec97024028848bfb640fe314fc7c1a2",
		"aa2f85a4f65645f7a43127c024e00661"
    ]
}




const _matter = {
	"id" : "857523467e0640b78e1bb7dd44308f38",
	"dark-matter" : {
        "type": "singular",
        "pseudo": ["857523467e0640b78e1bb7dd44308f38"],

		"name" : "clouds",
		"model" : "artwork",
		"created" : 1708604217879,
		"author" : "lee001",
		"defaultSlot" : "production"
	},
	"variants" : [
		{
			"name" : "production",
			"visible-matter" : "aa2f85a4f65645f7a43127c024e00661"
		},{
			"name" : "christmas",
			"visible-matter" : "bca8610e5fc9456986719d2b935c83fe"
		},{
			"name" : "subscriptions",
			"visible-matter" : "a7b6fa02a88044f581306d61272ea3ad"
		}
	],
	"visible-matter" : [
		"default",
		"abae90abe5ea46379eda4bd2ccf9230f",
		"bca8610e5fc9456986719d2b935c83fe",
		"533bb15119464a43af41cebe591274ef",
		"781373769a59494c949517366105a3c6",
		"04120cdd0ab44a38981ae81c40b2fec5",
		"a7b6fa02a88044f581306d61272ea3ad",
		"0ec97024028848bfb640fe314fc7c1a2",
		"aa2f85a4f65645f7a43127c024e00661"
	]
}


const visibleMatter = {
	"id" : "abae90abe5ea46379eda4bd2ccf9230f",
	"dark-matter" : {
		"name" : "New Edition"
	},
	"final" : {
		"name" : "Clouds",
		"title" : "White Ones",
		"subtitle" : "Lots of them",
		"description" : "URL to image"
	},
	"draft" : {
		"name" : "Clouds",
		"title" : "White Ones",
		"subtitle" : "Lots of them",
		"description" : "URL to image"
	}
}




const _pseudoMatter = {
	"id" : "857523467e0640b78e1bb7dd44308f38",
    "meta": {
        "type": "pseudo",
        "singular":"857523467e0640b78e1bb7dd44308f38",

		"created" : 1708604217879,
        "update": "manual|auto",
        "defaultSlot": "production|christmas|subscription|singular.defaultSlot" // singular.defaultSlot would be "production"
    },


	"slots" : [
		{
			"name" : "production",
			"edition" : "AAAAAAa4f65645f7a43127c024e00661"
		},{
			"name" : "christmas",
			"edition" : "BBBBBBBe5fc9456986719d2b935c83fe"
		},{
			"name" : "subscriptions",
			"edition" : "CCCCCCC2a88044f581306d61272ea3ad"
		}
	],
    "editions" : [
		"AAAAAAa4f65645f7a43127c024e00661",
		"BBBBBBBe5fc9456986719d2b935c83fe",
		"CCCCCCC2a88044f581306d61272ea3ad",
	]
}

/**
 * NOTES:
 *  When creating a Pseudo Matter, allow to choose slot ( and change if desired in future )
 * 
 * 
 * 
 * Types of NOTIFICATIONS
 *  - 
 */