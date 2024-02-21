# Matter

## Methods

---

**Matter.validateDoc(matterDefinition)**

Matter.validateDoc({
    id: {type: Squid, required: true},
    meta: {schema: new Schema({
        name: {type: ShortText, required: true},
        model: {type: ShortText, required: true},
        created: {type: Stamp, required: true, default: Date.now()},
        author: {type: ShortText, required: true},
        defaultSlot: {type: ShortText, required: true, default: "production"}
    }, required: true},
    slots: [{schema: new Schema({
        name: {type: ShortText, required: true},
        edition: {type: ShortText},
    })}],
    editions: [{type: ShortText}],
})

Returns:
Type: JSON Object
Example: {valid, sanitised, errors}

---

**Matter.create({model, author, name})**

*model:*
type: ShortText, required

Example:
Matter.create({
    model: "project",
    author: "author_id",
    name: "paul"
})

Matter.open({
    model: "project",
    name: "paul",
})



const matterInstance = Matter.open({
    name: "paul",
    model: "project"
})

matterInstance.fillSlot({
    name: "slotName",
    edition: "christmasEdition"
})

matterInstance.openSlot({
    name: "slotName"
})


## Environment Variables
### Required by Matter
TEST_DATABASE
TEST_COLLECTION
SESSION_USER_ID ( to be replaced with ID from Database for connected user)
MATTER_DATABASE

### Required by Dependencies

**Query**
COSMOS_CONNECTION_STRING

**Store**
VANILLA_ENV (optional)
COSMOS_CONNECTION_STRING
SESSION_DATABASE
SESSION_COLLECTION
STORE_SECRET
STORE_COOKIE_DOMAIN

**Identity**
KEY_VALUT_URL
IDENTITY_DATABASE



Model.create

Model.open




Matter.open

matter.createEdition




matter.slots.create
matter.slots.fillSlot
matter.slots.remove