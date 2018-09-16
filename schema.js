const graphql = require("graphql");
const _ = require("lodash");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

//Hardcoded Data
// const customers = [
//     { id: '1', name: 'jon', email: 'jon@jon.com', age: 35},
//     { id: '2', name: 'mariana', email: 'mariana@jon.com', age: 42},
//     { id: '3', name: 'marcus', email: 'marcus@jon.com', age: 26},
// ]

//Customer Type

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
});

// Root Query

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parent, args) {
        return axios
          .get("http://localhost:3000/customers/" + args.id)
          .then(response => response.data);
        // return _.find(customers, { id: args.id })
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      resolve(parent, args) {
        return axios
          .get("http://localhost:3000/customers/")
          .then(response => response.data);
      }
    }
  }
});

//Mutations

const MutationQuery = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: { type: GraphQLString },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        
      },
      resolve(args, parent) {
        return axios
          .post('http://localhost:3000/customers', {
            name: args.name,
            email: args.email,
            age: args.age,
          })
          .then(res => res.data)
          .catch(err => console.log(err))
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: MutationQuery
});
