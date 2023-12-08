const {Query} = require("../index.js");

const QMatter = new Query({
    database: process.env.QUERYCX_DATABASE,
    collection: process.env.QUERYCX_COLLECTION
});

class Matter {
    constructor(){}

    static async open(filter){
        return await QMatter.findOne(filter)
    }

    static async update(filter, docFrag){
        return await QMatter.updateOne(filter, docFrag)
    }

    static async replace(filter, document){
        return await QMatter.replaceOne(filter, document)
    }

    static async create(document){
        return await QMatter.insertOne(document)
    }

    static async exists(filter){
        const result = await QMatter.countDocuments(filter);

        return (result > 0) 
    }

}






const RequestMatterOpen = async (res, req) => {
    try {
        const result = await Matter.open({name: "VanillaCX"});
        console.log("RESULT3:", result);
    
    } catch(error){
        console.log("error", error);
    }
}

const RequestMatterReplace = async (res, req) => {
    try {
        const result = await Matter.replace({name: "VanillaCX"}, {site: "google.com"});
        console.log("RESULT4:", result);
    
    } catch(error){
        console.log("error", error);
    }
}

const RequestMatterCreate = async (document) => {
    try {
        const result = await Matter.create(document);
        console.log("RESULT5:", result);

    } catch(error){
        console.log("error", error);
    }
}

const RequestDoesMatterExist = async (filter) => {
    try {
        const result = await Matter.exists(filter);
        console.log("RESULT5:", result);

    } catch(error){
        console.log("error", error);
    }
}



// Simulate Route Callback in Express
//RequestMatterOpen({}, {});
//RequestMatterReplace({}, {});
//RequestMatterCreate({test: 'you', name: "fred"});
RequestDoesMatterExist({name: "fred", test: "you"});

console.log("END");