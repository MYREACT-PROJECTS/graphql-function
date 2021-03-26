const functions = require("firebase-functions");
const express =require("express")
//const cors = require('cors')
const mongoose= require('mongoose');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const {getUsers} = require('./authLogic')
const AUTH = require('./authModel')
const {schema} = require('./graphql/graphql-schema')
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt')




mongoose.connect("mongodb+srv://koutaiba:koutaiba@cluster0.gxrkn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(() => console.log('DB Connection Successfull'))
    .catch((err) => {
        console.error(err);
    });

//const {schema} = require('./graphql/graphql-schema')

//const graphqlHTTP = require('express-graphql')

app.use('/', graphqlHTTP({
    schema:schema,
    //rootValue: rootResolver,
    graphiql:true
  }));

  ///  app.get('/',(request,response)=>{
 ///      response.status(200).send("hello world")
/// })
//app.get('/users',getUsers)

   // app.listen(13031, () => console.log("Simple server running on http://localhost:2000"))










exports.graphql = functions.https.onRequest(app)
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

