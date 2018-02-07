# Testing

## Generator test suite

### Summary

`generators-feathers-plus` has a basic test suite that essentially tests `generate all`.
`npm run mocha:code` runs the test suite comparing generated code with expected code.
This suite runs quickly and success is generally indicative of the generator working properly.

`npm run mocha:tests` runs, for every generated app in the suite, the standard app test generated with the app.
This latter test requires all dependencies and starts up the app.
However it takes a long time.

`tests/writing.test.js` runs these tests. For test `service.test`,
it copies `test/service.test-copy/**` to the work directory.
This would always contain `feathers-gen-specs.json`.
It may also contain `name.schema.js` for services used in the generation,
so the test can extract the service schema from the module.

It then compares the contents generated in the work directly with `test/service.test-expected/**`
 
### Test description
 
Comments associated with each test describe how the modules in `*-copy/**` would have been generated.
For example
```js
  // t3,z3 (z2 ->) Test middleware creation.
  //* generate app            # z-1, Project z-1, npm, src1, socketio (only)
  //* generate service        # NeDB, nedb1, /nedb-1, nedb://../data, auth N, graphql Y
  //* generate service        # NeDB, nedb2, /nedb-2,                 auth N, graphql Y
  //  generate middleware     # mw1, *
  //  generate middleware     # mw2, mw2
  'middleware.test',
```
describes the middleware test.

The app was generated with the parameters shown.
Services `nedb-1` and `nedb-2` were generated with the parameters shown.
Then middlewares `mw1` was generated for path `*`, and `mw2` for `mw2`.

The repo `feathers-x/generator-old-vs-new` contains the initial apps generated with these parameters
using both David's generator and this one.
A source comparision tool was used identify the diffs between the two.

In the above example, the app generated by David's app is in `feathers-x/generator-old-vs-new/z2`
and the new generator's app (as the generator generated code at that time) is in `feathers-x/generator-old-vs-new/z2`

### Existing authentication tests

```js
  // t5, z5 Test authentication scaffolding.
  //  generate app            # z-1, Project z-1, npm, src1, REST and socketio
  //  generate authentication # Local and Auth0, users1, Nedb, nedb://../data, graphql Y
  'authentication-1.test',
  
  // t6, z6 (z5 ->) Test creation of authenticated service with auth scaffolding.
  //* generate app            # z-1, Project z-1, npm, src1, REST and socketio
  //* generate authentication # Local and Auth0, users1, Nedb, nedb://../data, graphql Y
  //  generate service        # NeDB, nedb1, /nedb-1, nedb://../data, auth Y, graphql Y
  'authentication-2.test',
  
  // t7, z7 (z6 ->) Test creation of non-authenticated service with auth scaffolding.
  //* generate app            # z-1, Project z-1, npm, src1, REST and socketio
  //* generate authentication # Local and Auth0, users1, Nedb, nedb://../data, graphql Y
  //* generate service        # NeDB, nedb1, /nedb-1, nedb://../data, auth Y, graphql Y
  //  generate service        # NeDB, nedb2, /nedb-2, nedb://../data, auth >> N <<, graphql Y
  'authentication-3.test'
```

### What this means

There is little need to test what the generator tests already test for.

This is also **not** a suggestion that tests be added to the generator test suite.
Each test takes a long time automate.

However it's worthwhile to keep track of keys tests which I can later consider adding to the test suite.

### A reasonable methodology for testing

It makes sense to create apps, based on the same parameters, using both David's generator and the new one,
and them comparing the code with a source comparison tool.

## Some templates

The existing authentication tests above test the "happy path" for authentication for NeDB.

David's generator has a template for MongoDb and RethinkDB to produce the files `src/mongodb.js`
and `src/rethinkdb.js`.
See `generators/writing/templates/src/services/_types/**`
They contain no authentication logic.

David's generator has a separate template for each adapter to result in file `name.service.js`.
See `generators/writing/templates/src/_adapters/**`
The templates are very static, generally just inserting the service name.
They contain no authentication logic.

David's generator has 2 separate templates for each adapter to result in file `name.model.js`,
one if the service is the `user-entity`, i.e. the service containing user records for authentication,
the other if its a normal service.
See `generators/writing/templates/src/services/_model/**`.

David's generator has 2 seperate templates for each adapter to result in file `name.hooks.js`.
However the new generator consolidates these into one hook template.

## Authentication tests

| Running of time

Things to test for
- Create unauth service, then create authentication with another service as user-entity.
- Like above but make the first service the user-entity.
- Create a service & user-entity. Then regen making the first service the user-entity.

Stupid shit like that.