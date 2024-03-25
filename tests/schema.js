console.log("SCHEMA TEST");
const util = require('util');


/**
 * CONSTANTS
 */
const SYNTAX_ERROR = "SYNTAX ERROR"
const TOO_LONG = "TOO LONG"
const TOO_SHORT = "TOO SHORT"
const TYPE_MISMATCH = "TYPE MISMATCH"

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

    static validate(value){
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

    validate(){
        return Email.validate(this.value)
    }

}

class ShortText extends DataType {
    constructor(value){
        super(value)
    }

    static name = "ShortText"

    static #minLength = 5;
    static #maxLength = 255;

    static validate(value){
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
            errors.push(TOO_SHORT)
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

    validate(){
        return ShortText.validate(this.value)
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

    test(document){

        console.log("Test() :::", this.definition)

        return {
            valid: true,
            errors: [],
            sanitised: "YEP"
        }
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

const originalSchema = new Schema({
    definition: {
        title: {type: ShortText, required: true},
        subtitle: {type: ShortText, required: true},
        dob: subSchema
    },
    required: false
})


const log = (obj, label = "") => {
    console.group(`\n${label}:`)
    console.log(util.inspect(obj, { depth: Infinity }));
    console.groupEnd()
}


stringified = originalSchema.toString()
parsed = Schema.parse(stringified)

const rebuiltSchema = new Schema({...parsed})



log(originalSchema, "originalSchema")
log(rebuiltSchema, "rebuiltSchema")

const {valid, sanitised, errors} = originalSchema.test({
    title: "Lee",
    subtitle: "Bowyer",
    dob: {
        day: "31",
        month: "Jan",
        year: "1979",
    }
})

log(valid, "valid")
log(sanitised, "sanitised")
log(errors, "errors")

