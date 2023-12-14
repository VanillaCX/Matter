console.log("MatterCX Test");
const { ShortText } = require("@VanillaCX/Schema");
const {Matter, Model} = require("../index.js");





const createModelRequest = async (req) => {
    try {
        const result = await Model.create({
            id: req.id,
            schema: req.schema
        })

        console.log("SUCCESS: ", result);;
    } catch(error) {
        console.log(error);
    }
}

const modelReq = {
    id: "Galleryss",
    schema: {
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        desc: {type: ShortText, required: true},
        image: {type: ShortText, required: true},
    }
}
//createModelRequest(modelReq);


const openModelRequest = async (req) => {
    try {
        const result = await Model.open(req.id)

        console.log("SUCCESS: ", result);;
    } catch(error) {
        console.log(error);
    }
}

const openModelReq = {
    id: "Galleryss"
}
//openModelRequest(openModelReq);



const openMatterRequest = async (req) => {
    try {
        const matter = await Matter.open({
            id: req.id,
            name: req.name,
            model: req.model
        })

        console.log("matter: ", matter);;
    } catch(error) {
        console.log(error);
    }
}

const openMatterReq = {
    id: null,
    name: "paul",
    model: "project"
}
//openMatterRequest(openMatterReq);





const createEditionRequest = async (req) => {
    try {
        const matter = await Matter.open({
            id: req.id,
            name: req.name,
            model: req.model
        })

        const edition = await matter.createEdition({document: req.document})

        console.log("matter: ", matter);
        console.log("edition: ", edition.final);
        console.log("edition: ", edition.draft);
    } catch(error) {
        console.log(error);
    }
}

const createEditionReq = {
    id: null,
    name: "paul",
    model: "project",
    document: {
        title: "Jooles",
        subtitle: "McCartney"
    }
}
//createEditionRequest(createEditionReq);



const updateEditionRequest = async (req) => {
    try {
        const matter = await Matter.open({
            id: req.id,
            name: req.name,
            model: req.model
        })

        const edition = await matter.createEdition({document: req.document})


        console.log("matter: ", matter);
        console.log("edition: ", edition.final);
        console.log("edition: ", edition.draft);
    } catch(error) {
        console.log(error);
    }
}

const updateEditionReq = {
    id: null,
    name: "paul",
    model: "project",
    document: {
        title: "J",
        subtitle: "McCartney"
    }
}
//updateEditionRequest(updateEditionReq);





const listSlotsRequest = async (req) => {
    try {
        const matter = await Matter.open({
            name: req.name,
            model: req.model
        })

        
        const slots = matter.slots;

        console.log(slots);

        slots.create("xmas");
        console.log(slots);

        slots.fillSlot("xmas", "test")
        console.log(slots);

        slots.remove("default")
        console.log(slots);

    } catch(error) {
        console.log(error);
    }
}

const listSlotsReq = {
    name: "paul",
    model: "project",
}
//listSlotsRequest(listSlotsReq);

const editionsRequest = async (req) => {
    try {
        const matter = await Matter.open({
            name: req.name,
            model: req.model
        })


        const newEdition = await matter.editions.create({document: req.document})

        const oldEdition = await matter.editions.open("09d9291e706b416d8ac337f8bed54086");

        /*console.log("matter:", matter);
        console.log("oldEdition:", oldEdition);
        console.log("matter.editions:", matter.editions);
        console.log("oldEdition:", oldEdition.draft);
        console.log("oldEdition.meta:", oldEdition.meta);*/

        //console.log(matter);
        //console.log(matter.meta.tags);
        //console.log(matter.editions.matter.meta.tags);

        /*console.group("Create");
        console.log("newEdition.draft", newEdition.draft);
        console.log("newEdition.final", newEdition.final);
        await newEdition.updateDraft({
            subtitle: "TAFKAP"
        });
        console.groupEnd();
        console.group("Updated Draft");
        console.log("newEdition.draft", newEdition.draft);
        console.log("newEdition.final", newEdition.final);
        await newEdition.approveDraft();
        console.groupEnd();
        console.group("Approved Draft");
        console.log("newEdition.draft", newEdition.draft);
        console.log("newEdition.final", newEdition.final);*/
        //console.log(matter.editions);
        //console.log(matter.slots.list);
        //console.log("matter.meta:", matter.slots.matter.meta.list);
        //console.log("matter.meta:", matter.meta.list);
        //matter.meta.tag("author", "ZUZ")
        //console.log("matter.meta:", matter.meta.list);
        //console.log("matter.slots:", matter.slots);

        console.log(matter.meta.list)
        matter.meta.tag("author", "A")
        console.log(matter.meta.list)

        /*matter.slots.create("testing");
        console.log("matter.slots:", matter.slots.default);

        matter.slots.default = "updated";
        console.log("matter.slots:", matter.slots.default);*/

    } catch(error) {
        console.log(error);
    }
}

const editionsReq = {
    id: null,
    name: "paul",
    model: "project",
    document: {
        title: "Prince",
        subtitle: "Rogers Nelson"
    }
};
//editionsRequest(editionsReq);
/*

*/
/*
(async () => {
    const req = {
        name: "pausslsssssssssssssssssss",
        model: "project",
        author: "Me",
        document: {
            title: "Hey"
        }
    }

    try {
        const matter = await Matter.create({
            model: req.model,
            name: req.name,
            author: req.author
        });

        const edition = await matter.editions.create({document: req.document})
        
        console.log("Successfully created new Matter and Edition", matter, edition);

        console.log("edition.final: ", edition.final);

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
})();

(async () => {
    const req = {
        name: "paul",
        model: "project"
    }

    try {
        const matter = await Matter.open({
            name: req.name,
            model: req.model
        })

        const editionDefaultSlot = await matter.openSlot(); 

        console.log("editionDefaultSlot.final:", editionDefaultSlot.final);

        const editionNamedSlot = await matter.openSlot("default"); 
        console.log("editionNamedSlot.final:", editionNamedSlot.final);

        const editionByID = await matter.editions.open("706e8d5a45994ddcb99a11051ae23849");
        console.log("editionByID.final:", editionByID.final);

    } catch(error) {
        switch(error.message) {
            case "MATTER_NOT_FOUND":
                console.log("Matter Deosnt Exist");
                break;
            case "EMPTY_SLOT":
                console.log("Slot is empty");
                break;
            case "NO_DEFAULT_SLOT":
                console.log("No default slot");
                break;
            case "NO_SUCH_SLOT":
                console.log("Slot doesnt exist");
                break;
            default:
                console.log(error);
        }
    }
})();*/


(async () => {
    const req = {
        name: "paul",
        model: "project",
        document: {
            title: "Hey",
            subtitle: `There ${Date.now()}`
        }
    }

    try {
        const matter = await Matter.open({
            name: req.name,
            model: req.model
        })


        const edition = await matter.editions.create({document: req.document})
        
        //console.log("Successfully created new Matter and Edition", matter, edition);
        console.log("New Edition ID:", edition.id);

        // Change Edition in SLot "default"
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
})();




