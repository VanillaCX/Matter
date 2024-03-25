
# API Design
## Its BACK end. Not FRONT end.

* GET (fetching only)
* POST:
  - Create new resource
  - submit form data
* PUT: Updating a specified resource in its integrality
* DELETE: Remove a specified resource
* PATCH: Partial update to specified resource 

Views are MODEL tied, not MATTER tied


## Headless
### Serving of Matter

## Model
[GET] api.matter.cx/project    

## Matter
[GET] api.matter.cx/project/paul    
[GET] api.matter.cx/project/paul/branch

Get JSON for a particular view of matter in main branch
[GET] api.matter.cx/project/main/paul/preview


### Creation, Modification etc of Matter

## Models
Create new model
[POST] api.matter.cx/project

Partial update of resource:
[PATCH] api.matter.cx/project

Full update of resource:
[PUT] api.matter.cx/project

Delete specified resource
[DELETE] api.matter.cx/project

## Matter
Create new matter:
[POST] api.matter.cx/project/main/paul

Partial update of resource:
[PATCH] api.matter.cx/project/main/paul

Full update of resource:
[PUT] api.matter.cx/project/main/paul

Delete specified resource
[DELETE] api.matter.cx/project/main


### Filtering of Matter

List all matter of type project
[GET] api.matter.cx/project/main



## Headed

When a surface makes a request for matter, it specifies what fields it requires, no need for all data if only displaying half

Get default HTML view for matter
[GET] api.surface.cx/project/paul

Get specified HTML view for matter
[GET] api.surface.cx/project/paul/preview



{AUTH}: Authorised user
{GUEST}: Guest user

lee.matter.cx/
200
    [GET] - Finder for all Models and Matter
    {AUTH}: Brwse/Create/Edit/Delete Matter, PseudoMatter, Models
    {GUEST}: Browse models / matter

lee.matter.cx/project
200
    [GET] - List ALL projects
    {AUTH}: Create/Edit/Delete Models
    {GUEST}: Browse matter

lee.matter.cx/newproject
    [GET]: A resource that diesnt exist 
    {AUTH}: Create page for new model
    {GUEST}: Request model creation / 404

lee.matter.cx/project/paul
    [GET] - Displays Paul matter at main branch (drop down to switch branch)
    {AUTH}: Create PseudoMatter/New Branch/Edit/Delete
    {GUEST}: View public facing edition / branches

lee.matter.cx/project/john
    [GET]: A resource that diesnt exist 
    {AUTH}: Create page for new resource (john)
    {GUEST}: Request matter creation / 404

lee.matter.cx/project/paul/branches
    [GET] - Displays List of branches for Paul project
    {AUTH}: Create New/Edit/Delete Branches
    {GUEST}: Browse public facing branches

lee.matter.cx/project/paul/branches/special
    [GET] - Displays specified branch
    {AUTH}: Create New/Edit/Delete Branch
    {GUEST}: View branch

lee.matter.cx/project/paul/branches/newbranch
    [GET] - A resource that doesnt exist
    {AUTH}: Page to create new branch
    {GUEST}: Request to create / 404
