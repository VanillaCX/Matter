console.log("SCHEMA TEST");
const util = require('util');
const {RequiredError} = require("@VanillaCX/Errors")



const throwAnError = () => {
    throw new RequiredError("Missing User Name")
}

try {
    throwAnError()

} catch(e) {
    console.log(e)
}

/**
 * CONSTANTS
 */
const SYNTAX_ERROR = "SYNTAX ERROR"
const TOO_LONG = "TOO LONG"
const TOO_SHORT = "TOO SHORT"
const TYPE_MISMATCH = "TYPE MISMATCH"
const MISSING_REQUIRED = "MISSING REQUIRED"

/**
 * CLASSES
 */
class DataType {
    
    constructor(value){
        this.value = value
    }

    static #allowBasicHTML = false;
    static #removeAllHTMLTags = /(<[^>]+>)/g;
    static #keepBasicHTMLTags = /(<[^>]+>)/g;


    static stripHTML(value, {allowBasicHTML = DataType.#allowBasicHTML} = {}){
        value = String(value)
        const regExp = (allowBasicHTML) ? DataType.#keepBasicHTMLTags : DataType.#removeAllHTMLTags;

        const stripped = value.replace(regExp, "");

        return stripped
    }
    
}

class Email extends DataType {
    constructor(value){
        super(value)
    }

    static name = "Email"

    static #minLength = 5;
    static #maxLength = 255;
    static #syntax = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    static test(value){
        const errors = []
        value = this.stripHTML(value);

        if(value.length < this.#minLength){
            errors.push(TOO_SHORT)
        }
        
        if(value.length > this.#maxLength){
            errors.push(TOO_LONG)
        }
        
        if(!this.#syntax.test(value)){
            errors.push(SYNTAX_ERROR)
        }
        
        const valid = (errors.length === 0);
        const sanitised = (valid) ? value : null;
        
        return {
            valid,
            errors,
            sanitised
        };

    }

    test(){
        return Email.validate(this.value)
    }

}

class ShortText extends DataType {
    constructor(value){
        super(value)
    }

    static name = "ShortText"

    static #minLength = 2;
    static #maxLength = 255;

    static test(value){
        const errors = []
        value = this.stripHTML(value);

        if(typeof value === "number"){
            value = value.toString();
        }

        if(typeof value === "string"){
            value = this.stripHTML(value);

        } else {
            errors.push(TYPE_MISMATCH)
        
        }

        if(value.length < this.#minLength){
            errors.push(VanillaTooLong.code)
        }
        
        if(value.length > this.#maxLength){
            errors.push(TOO_LONG)
        }
        
        const valid = (errors.length === 0);
        const sanitised = (valid) ? value : null;
        
        return {
            valid,
            errors,
            sanitised
        };

    }

    test(){
        return ShortText.test(this.value)
    }

}



class Schema {
    constructor({definition, required = false} = {}){
        this.definition = definition
        this.required = required
        this.type = Schema
    }

    static parse(stringifiedJSON){
        return JSON.parse(stringifiedJSON, (key, value) => {
            if (key === "type") {
                // Doubling the age value
                return dataTypes[value]
            }
            return value;
        })
    }

    toString(pretty = false){
        // Using replacer function to replace value of type (which is class / object) with its name (value.name)
        return JSON.stringify(this, (key, value) => {
            if (key == "type") {
                return value.name
            } 

            return value
        })
    }

    isSchema(value){
        return (value && value.type && value.type.name == "Schema") ? true : false
    }

    isRule(value) {
        return (value && value.type && value.type.name) ? true : false
    }

    isList(value) {
        return Array.isArray(value)
    }

    #test(schema, document){
        let sanitised = {}
        let errors = {}
        let valid = true

        for (const [key, value] of Object.entries(schema.definition)){

            

            if(this.isSchema(value)){

                /**
                 * SCHEMA: LIST-BASED DEFINITION
                 */
                if (this.isList(value.definition)) {
                    // Defintiion is a list

                    const listRuleSet = value.definition[0]
                    const listRequired = value.required
                    const list = document[key] || []


                    if(listRequired && list.length == 0){
                        errors[key] = MISSING_REQUIRED
                    } else {
                        for(const entry of list){
                            const listEntryResult = this.#test({definition: listRuleSet}, entry)
                            
                            if (listEntryResult.valid == false) {
                                if (!errors[key]) {
                                    errors[key] = []
                                }
                                errors[key].push(listEntryResult.errors)
                            } else {
                                if (!sanitised[key]) {
                                    sanitised[key] = []
                                }
                                sanitised[key].push(listEntryResult.sanitised)
                            }
                        }
                    }

                /**
                 * SCHEMA: OBJECT-BASED DEFINITION
                 */
                } else {
                    const childSchemaResults = this.#test(value, document[key])

                    if (childSchemaResults.valid == false) {
                        errors[key] = childSchemaResults.errors
                    } else {
                        sanitised[key] = childSchemaResults.sanitised
                    }
                }

                
            /**
             * RULE: SINGLE
             */
            } else if (this.isRule(value)) {
                if(!document || !document[key]) {
                    if (value.required) {
                        errors[key] = MISSING_REQUIRED
                    }
                } else {
                    const ruleResults = value.type.test(document[key])

                    if (ruleResults.valid == false) {
                        errors[key] = ruleResults.errors
                    } else {
                        sanitised[key] = ruleResults.sanitised
                    }
                }


                

            /**
             * RULE: LIST OF RULES
             */
            } else if (this.isList(value) && this.isRule(value[0])) {

                    const rule = value[0];
                    const list = document[key] || [];

                    if(rule.required && list.length == 0){
                        errors[key] = MISSING_REQUIRED
                    } else {
                        for(const entry of list){

                            const ruleResults = rule.type.test(entry)

                            if (ruleResults.valid == false) {
                                if (!errors[key]) {
                                    errors[key] = []
                                }
                                errors[key].push(ruleResults.errors)
                            } else {
                                if (!sanitised[key]) {
                                    sanitised[key] = []
                                }
                                sanitised[key].push(ruleResults.sanitised)
                            }
                        }
                    }

                    


            }
        }

        // Check if meets required requirements
        if (schema.required && Object.keys(schema.definition).length == 0) {
            errors["BASE"] = MISSING_REQUIRED
        }

        // Invalid document
        if ((Object.keys(errors).length > 0)) {
            valid = false;
            sanitised = {}
        }

        return {
            valid,
            sanitised,
            errors
        }
    }

    test(document){
        const result = this.#test(this, document)

        return result
    }
}

const dataTypes = {
    "ShortText": ShortText,
    "Email": Email,
    "Schema": Schema,
}


const subSchema = new Schema({
    definition: {
        day: {type: ShortText, required: true},
        month: {type: ShortText, required: true},
        year: {type: ShortText, required: true}
    },
    required: true
})



const metaSchema2 = new Schema({
    definition: [{
        key: {type: ShortText, required: true},
        value: {type: ShortText, required: true}
    }],
    required: true
})



const originalSchema = new Schema({
    definition: {
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        list: [{type: ShortText, required: true}],
        meta2: metaSchema2,
        dob: subSchema
    },
    required: true
})


const log = (obj, label = "") => {
    console.group(`\n${label}:`)
    console.log(util.inspect(obj, { depth: Infinity }));
    console.groupEnd()
}


stringified = originalSchema.toString()
parsed = Schema.parse(stringified)

const rebuiltSchema = new Schema({...parsed})



//log(originalSchema, "originalSchema")
//log(rebuiltSchema, "rebuiltSchema")

const document = {
    title: "c",
    subtitle: "Bowyer",
    list: ["One", "Two"],
    meta2: [{
        key: "THREE",
        value: "FOURS"
    },{
        key: "FIVES",
        value: "SIXES"
    }],
    dob: {
        day: "31",
        month: "Jan",
        year: "1979",
    }
}

const empty_document = {}

const {valid, sanitised, errors} = originalSchema.test(document)

log(valid, "valid")
log(sanitised, "sanitised")
log(errors, "errors")

