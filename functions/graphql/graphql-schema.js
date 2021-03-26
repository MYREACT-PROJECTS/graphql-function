//const {getUsers} = require ('../authLogic')
const AUTH = require('../authModel')
const CONTACTS = require('../contactsModels')
//const mutation = require('./mutation/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const {GraphQLNonNull,GraphQLInputObjectType} = require('graphql')



const {GraphQLSchema
    ,GraphQLObjectType,GraphQLList,GraphQLString,GraphQLID,
    } = require('graphql');

    const contactsType =new GraphQLObjectType({
        name: "contacts",
        description:"",
        fields:()=>({
            name:{
                type:GraphQLString,
                description:"",
            },
            phone:{
                type:GraphQLString,
                description:"",
            },
            token:{
                type:GraphQLString,
                description:"",
            },


        })  
    })
    const usersType = new GraphQLObjectType({
        name :"users",
        description:"this users filed",
        fields: () => ({
            id:{
                type:GraphQLID,
                description:""
            },
            name: {
                type:GraphQLString,
                description:"",
            },
            email:{
                type:GraphQLString,
                description:"",
            },
            password:{
                type:GraphQLString,
                description:"",
            },
            type:{
                type:GraphQLID,
                description:""
            },
            token:{
                type:GraphQLString,
                description:""
            }
            
         
           
        })
    })
    
    const queryType= new GraphQLObjectType({
       name : "Query",
       description:"this is query type",
       fields:{
           users:{
               type:new GraphQLList(usersType),
               description:"this is the list of users return",
               resolve:async function () {
                const auth = await AUTH.find()
                return auth
               }
           },
           user :{
               type: usersType,
               description:'',
               args:{
                   id:{
                       type:GraphQLID,
                       description:"",
                   },
                   
               },
               resolve: async(_,args)=>{
                const auth = await AUTH.findById(args.id) 
                return auth
               }
             },
             contacts:{
                 type:GraphQLList(contactsType),
                 description:"",
                 args:{
                    token:{
                        type:GraphQLString,
                        description:"",
                    },
                    
                },
                 resolve:async function (root, params) {
                    const token = params.token.split(" ")[1];
                    const decode = jwt.verify(token,"user");
                    console.log("decode",decode)
                    if(decode){
                        const contacts = await CONTACTS.find()
                       return contacts

                    }
                    else{
                        {throw new Error('auth for user is error')}
                    }



                     
                    
             }


       }
    
       }
    
    })
 

    const addUser = {
        type: usersType,
       args: {
           
           
           name: {
               name: 'name',
               type: new GraphQLNonNull(GraphQLString)
           },
           password: {
               name: 'password',
               type: new GraphQLNonNull(GraphQLString)
           },
           email: {
               name: 'email',
               type: new GraphQLNonNull(GraphQLString)
           },
           type: {
               name: 'type',
               type: new GraphQLNonNull(GraphQLID)
           }
   
       ,
   }, async resolve(parent, args) {
        const user = await AUTH.findOne({email:args.email})
        if (user){
           throw new Error('email is existed')
   
        }      
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(args.password, 15, function(err, hash) {
              if (err) reject(err)
              resolve(hash)
            });
          })
      
            
                const auth = await new AUTH ({
                name:args.name,
                email:args.email,
                password:hashedPassword,
                type:args.type
   
            })
            const newAuthor = await auth.save()
            console.log(newAuthor)
            
   return newAuthor
 
      
}
      
    }   
   
    const logIn = {
        type: usersType,
       args: {
           
           
         
           password: {
               name: 'password',
               type: new GraphQLNonNull(GraphQLString)
           },
           email: {
               name: 'email',
               type: new GraphQLNonNull(GraphQLString)
           },
         
       
   }, async resolve(parent, args) {
        const user = await AUTH.findOne({email:args.email})
        if (!user){
           throw new Error('email is NOT existed')
           }       
          const valid = await bcrypt.compare(
            args.password,
            user.password
          );
          if (!valid) {
            throw new Error('Invalid password');
          }
            console.log("ddd",valid) 

         const hashedPassword = await new Promise((resolve, reject) => {
              
                const token1=  jwt.sign({email:user.email,name:user.name},"user")
                const token2=  jwt.sign({email:user.email,name:user.name},"admin")
                if (user.type==0){
                    resolve(token1)
                }
                else{
                    resolve(token2)
                }

          })
   
               console.log('token',hashedPassword)
          return {
              token:hashedPassword
          }
             
}
   
    }   
   /////////////////////////////ADD CONTACTS
   const addContacs = {
    type: contactsType,
   args: {
       
       
       name: {
           name: 'name',
           type: new GraphQLNonNull(GraphQLString)
       },
       phone: {
           name: 'phone',
           type: new GraphQLNonNull(GraphQLString)
       },
       token:{
        name: 'token',
        type: new GraphQLNonNull(GraphQLString)

       }
   
   
}, async resolve(parent, args) {
    const token = args.token.split(" ")[1];
    const decode = jwt.verify(token,"admin");
    console.log("decode",decode)
    if(!decode){
        {throw new Error('auth for admin is error')}
           }
   //////////////////////
    
        
            const contacts  = await new CONTACTS ({
            name:args.name,
            phone:args.phone,
            

        })
        const newContacts = await contacts.save()
        console.log(newContacts)
        
return newContacts

  
}
  
}   

  
   


    //////////////schema defination
    const schema = new GraphQLSchema({
        query:queryType,
        mutation: new GraphQLObjectType({
            name: 'Mutation',
            fields: {addUser,logIn,addContacs}
    
        })
     
    })


exports.schema=schema
