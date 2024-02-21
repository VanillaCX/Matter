console.log("MatterCX Test");
const { ShortText } = require("@VanillaCX/Schema");
const {Matter, Model} = require("../index.js");


const createModel = async () => {

    try {
        const result = await Model.create({
            id: "watercolour",
            schema: {
                title: {type: ShortText, required: true},
                subtitle: {type: ShortText, required: true},
                desc: {type: ShortText, required: true},
                image: {type: ShortText, required: true},
            }
        })

        console.log("Created Model: ", result);;
    } catch(error) {
        console.log(error);
    }

}

//createModel()

const openModel = async () => {
    try {
        const result = await Model.open("watercolour")

        console.log("Opened Model: ", result);;
    } catch(error) {
        console.log(error);
    }
    
}

//openModel()

const createMatter = async () => {

    
    const matter = await Matter.create({
        model: "watercolour",
        name: "Paul",
        author: "Me"
    });

    console.log("Successfully created new Matter", matter);
}

createMatter()

const createEdition = async () => {
    try {
        // Get Matter object
        const matter = await Model.open("Songs")

        // Create new edition
        const edition = await matter.editions.create({document: {
            title: "The Chapkas",
            subtitle: "Demo Tapes",
            desc: "Demo tapes from a long time ago.",
            image: "URL to image",
        }})

        console.log("New Edition ID:", edition.id);

        // Set new Edition to be the default edition for matter
        await matter.fillSlot({
            name: "default",
            edition: edition.id
        })

    } catch(error) {
        switch(error.message) {
            case "MODEL":
                console.log("Model Deosnt Exist");
                break;
            case "MATTER_ALREADY_EXISTS":
                console.log("Matter already exists");
                break;
            default:
                console.log(error);
        }
    }
    
}

//createEdition()

console.log("THE END")