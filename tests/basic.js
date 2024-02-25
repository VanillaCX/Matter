console.log("MatterCX Test");
const { Schema, ShortText, LongText } = require("@VanillaCX/Schema");
const {Matter, Model} = require("../index.js");


const createModel = async ({model_id}) => {


    const schema = new Schema({
        name: {type: ShortText, required: true},
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        description: {type: LongText, required: true}
    })

    try {
        const result = await Model.create({
            id: model_id,
            schema
        })

        console.log("Created: ", result);

    } catch(error) {
        console.log(error);
    }

}



const openModel = async ({model_id}) => {


    try {
        const model = await Model.open(model_id)

        console.log("model: ", model);
    } catch(error) {
        console.log(error);
    }

}

const createMatter = async ({model_id, matter_name}) => {

    const author = "lee001"
    
    try {
        const matter = await Matter.create({
            model: model_id,
            name: matter_name,
            author: author
        });
    
        console.log("Create new matter", matter);
    } catch(error) {
        console.log(error);

    }
}

const createEdition = async ({model_id, matter_name, document}) => {

    console.log("Going to open...", {
        model: model_id,
        name: matter_name,
    });

    try {
        const matter = await Matter.open({
            model: model_id,
            name: matter_name,
        });

    
        // Create new edition
        const edition = await matter.editions.create({document})

        // Put new Edition in default slot
        await matter.fillSlot({edition: edition.id})

        // Not created yet
        //matter.removeSlot({name: "chrsitmas"})

        
        //matter.openSlot()


        console.group("Edition Details ...")
        console.log("edition.id:", edition.id)
        console.log("edition.final:", edition.final)
        console.log("edition.draft:", edition.draft)
        console.log("matter.editions.list:", matter.editions.list)
        console.log("matter.slots.list:", matter.slots.list)
        console.groupEnd()
        
    } catch(error) {
        console.log(error);

    }

    
}

const openMatterDefaultEdition = async ({model_id, matter_name}) => {

    try {
        const matter = await Matter.open({
            model: model_id,
            name: matter_name,
        });



        const edition = await matter.getDefaultEdition();

        //const edition = await matter.editions.open(id);

        //matter.slots.fill({slot: "Christmas", edition: edition.id})
        //matter.slots.remove("Christmas")
        //matter.slots.exists("Christmas")
        //matter.slots.get("Christmas")
        //matter.slots.list
        //matter.slots.create("Christmas")



        console.group("Edition Details ...")
        console.log("edition.final:", edition.final)
        console.log("edition.draft:", edition.draft)
        console.groupEnd()
        
    } catch(error) {
        console.log(error);

    }

    
}

const openMatterEditionInSlot = async ({model_id, matter_name}) => {

    try {
        const matter = await Matter.open({
            model: model_id,
            name: matter_name,
        });



        const edition = await matter.getEditionInSlot("default");

        //const edition = await matter.editions.open(id);

        // Gets edition stored in default slot

        //matter.slots.fill({slot: "Christmas", edition: edition.id})
        //matter.slots.remove("Christmas")
        //matter.slots.exists("Christmas")
        //matter.slots.get("Christmas")
        //matter.slots.list
        //matter.slots.create("Christmas")



        console.group("Edition Details ...")
        console.log("edition.final:", edition.final)
        console.log("edition.draft:", edition.draft)
        console.groupEnd()
        
    } catch(error) {
        console.log(error);

    }

    
}


const openMatterUpdateDraft = async ({model_id, matter_name, updated_document}) => {

    try {
        const matter = await Matter.open({
            model: model_id,
            name: matter_name,
        });


        // Open default Edition
        const edition = await matter.getDefaultEdition();

        console.log("draft before update: ", edition.draft)

        const updated_draft = await edition.updateDraft(updated_document)


        console.group("Edition Details ...")
        console.log("edition.final:", edition.final)
        console.log("edition.draft:", edition.draft)
        console.groupEnd()
        
    } catch(error) {
        console.log(error);

    }

    
}

const openMatterApproveDraft = async ({model_id, matter_name}) => {

    try {
        const matter = await Matter.open({
            model: model_id,
            name: matter_name,
        });


        // Open default Edition
        const edition = await matter.getDefaultEdition();

        await edition.approveDraft()

        console.group("Edition Details ...")
        console.log("edition.final:", edition.final)
        console.log("edition.draft:", edition.draft)
        console.groupEnd()
        
    } catch(error) {
        console.log(error);

    }

    
}




// WORKS
//createModel({model_id: "artwork"})

// WORKS
//openModel({model_id: "artwork"})

// WORKS
//createMatter({model_id: "artwork", matter_name: "clouds"})

// WORKS
/*createEdition({model_id: "artwork", matter_name: "clouds", document: {
    name: "Sky",
    title: "Blue Ones",
    subtitle: "Lots of them",
    description: "URL to image"
}})*/

// WORKS
//openMatterDefaultEdition({model_id: "artwork", matter_name: "clouds"})

// WORKS
//openMatterEditionInSlot({model_id: "artwork", matter_name: "clouds"})

// WORKS
/*openMatterUpdateDraft({model_id: "artwork", matter_name: "clouds", updated_document: {
    subtitle: `Subtitle Changed  at ${Date.now()}`,
}})*/

openMatterApproveDraft({model_id: "artwork", matter_name: "clouds"})