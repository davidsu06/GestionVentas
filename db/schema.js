const { gql } = require('apollo-server');

const typeDefs = gql`
    type Token {
        token: String
    }

    type Admin {
        email: String
        password: String
    }

    type Product {
        name: String
        brand: String
        reference: String
        units: Int
        price: Float
        description: String
    }

    type Customer {
        name: String
        lastname: String
        document: String
        email: String
        phone: String
        total: Float
    }

    type Sale {
        id: ID
        sale: [SaleGroup]
        total: Float
        customer: String
        customerName: String
        saleReference: String
    }

    type SaleGroup {
        reference: String
        units: Int
        name: String
        price: Float
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input AdminInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        brand: String!
        reference: String!
        units: Int!
        price: Float!
        description: String!
    }

    input ProductDeleteInput {
        reference: String!
    }

    input ProductEditInput {
        name: String
        brand: String
        reference: String!
        units: Int
        price: Float
        description: String
    }

    input ProductReference {
        reference: String!
    }

    input CustomerInput {
        name: String!
        lastname: String!
        document: String!
        email: String!
        phone: String!
        total: Float!
    }

    input CustomerDeleteInput {
        document: String!
    }

    input CustomerEditInput {
        name: String
        lastname: String
        document: String!
        email: String
        phone: String
    }

    input CustomerDocument{
        document: String!
    }

    input SaleInput {
        sale: [SaleGroupInput]
        total: Float!
        customer: String!
        saleReference: String!
    }

    input SaleGroupInput {
        reference: String!
        units: Int!
        name: String!
        price: Float!
    }

    type Query {
        #Users
        getAdmins : [Admin]
        getCustomers: [Customer]
        getCustomer(input: CustomerDocument): Customer

        #Products
        getProducts: [Product]
        getProduct(input: ProductReference): Product

        #Sales
        getSales: [Sale]
        
    }

    type Mutation {
        #Users
        authUser(input: AuthInput) : Token
        createAdmin(input: AdminInput): Admin

        #Products
        createProduct(input: ProductInput): Product
        deleteProduct(input: ProductDeleteInput): String 
        editProduct(input: ProductEditInput): Product

        #Customers
        createCustomer(input: CustomerInput): Customer
        deleteCustomer(input: CustomerDeleteInput): String
        editCustomer(input: CustomerEditInput): Customer

        #Sales
        createSale(input: SaleInput): Sale
        
    }

`;

module.exports = typeDefs;