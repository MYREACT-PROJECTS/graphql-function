const { GraphQLID } = require('graphql');
const AUTH = require('../../authModel')
const CONTACTS = require('../../contactsModels')
const usersType = require('../../graphql/graphql-schema')
const {GraphQLNonNull, GraphQLString,GraphQLInputObjectType} = require('graphql')


const addUser = {
     type: usersType,
    args: {
        input: {
            type: new GraphQLNonNull(new GraphQLInputObjectType({
                name: 'LoginInput',
                fields: {
        
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
}
}))
    }
},   resolve: async function (root, params) {
        const uModel = new AUTH(params);
        const newUser = await uModel.save();
        if(!newUser) {
            throw new Error('Error')
        }
        return newUser
    }







    
}

module.exports = {addUser}
