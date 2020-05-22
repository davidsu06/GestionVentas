const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectDB = require('./config/db');
require('dotenv').config({ path: 'variables.env '})

connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen({ port: process.env.PORT || 4000 }).then( ({url}) => {
    console.log(`Servidor listo en ${url}`)
})