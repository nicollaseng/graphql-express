const graphql = require('graphql')
const _ = require('lodash')

const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = graphql

//Hardcoded Data
const customers = [
    { id: '1', name: 'jon', email: 'jon@jon.com', age: 35},
    { id: '2', name: 'mariana', email: 'mariana@jon.com', age: 42},
    { id: '3', name: 'marcus', email: 'marcus@jon.com', age: 26},
]

//Customer Type

const CustomerType = new GraphQLObjectType({
    name: 'Customer',
    fields: () => ({
        id: { type: GraphQLString },
        name:{ type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLString) }
    })
})

// Root Query

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        customer: {
            type: CustomerType,
            args: {
                id: { type:  GraphQLString }
            },
            resolve(parent, args){
                return _.find(customers, { id: args.id })
            }
        },
        customers: {
            type: new GraphQLList(CustomerType),
            resolve(parent, args){
                return customers
            }
        }
    }
    
})

module.exports = new GraphQLSchema({
    query: RootQuery,
})