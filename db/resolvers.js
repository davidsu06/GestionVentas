const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env '})

const createToken = (user, word, expiresIn) => {
    const { id, email } = user;

    return jwt.sign( { id, email }, word, { expiresIn} )
}

const resolvers = {
    Query: {
        getAdmins: async () => {

            try {
                const admins = await Admin.find({});
                return admins;
            } catch (error) {
                console.log(error)
            }
        },

        getCustomers: async () => {
            try {
                const customers = Customer.find({}).sort( { total: -1 });
                return customers;
            } catch (error) {
                console.log(error);
            }
        },

        getCustomer: async (_, { input }) => {
            const { document } = input;

            const customer = await Customer.findOne({ document });
            if (!customer) {
                throw new Error('El cliente no existe');
            }

            return customer;
        },

        getProducts: async () => {

            try {
                const products = await Product.find({});
                return products;
            } catch (error) {
                console.log(error)
            }
        },

        getProduct: async (_, { input }) => {
            const { reference } = input;

            const product = await Product.findOne({ reference });
            if (!product) {
                throw new Error('El producto no existe');
            }

            return product;
        },

        getSales: async () => {
            const sales = await Sale.find({});
            console.log(sales)
            let newSales = [];
            
            for await ( const sale of sales ){
                
                const customerInfo = await Customer.findById(sale.customer);
                
                newSales.push(
                    {
                        sale: sale.sale,
                        id: sale._id,
                        total: sale.total,
                        customer: customerInfo.document,
                        customerName: customerInfo.name + ' ' + customerInfo.lastname,
                        saleReference: sale.saleReference
                    }
                );
            }

            return newSales;
        }
    },

    Mutation: {
        authUser: async (_, { input }) => {
            const { email, password } = input;
            
            const userExists = await Admin.findOne({ email });
            if (!userExists) {
                throw new Error('El usuario no existe'); 
            }
            
            const correctPassword = await bcryptjs.compare(password, userExists.password);
            if (!correctPassword) {
                throw new Error('Contraseña incorrecta');
            }

            //Token creation
            return {
                token: createToken(userExists, process.env.SECRET, '24h')
            }
        },

        createAdmin: async (_, { input }) => {
            const { email, password } = input;

            const adminExists = await Admin.findOne({ email });
            if (adminExists) {
                throw new Error('El administrador ya se encuentra registrado');
            }

            const salt = await bcryptjs.genSalt(10);
            input.password = await bcryptjs.hash(password, salt);

            try {
                const admin = new Admin(input);
                admin.save();
                return admin;
            } catch (error) {
                console.log(error)
            }
        },

        createProduct: async (_, { input }) => {
            const { reference } = input;

            const productExists = await Product.findOne({ reference });
            if (productExists) {
                throw new Error('El producto ya existe');
            }

            try {
                const product = new Product(input);
                product.save();
                return product;
            } catch (error) {
                console.log(error);
            }

        },

        deleteProduct: async (_, { input }) => {
            const { reference } = input;

            const productExists = await Product.findOne({ reference });
            if (!productExists) {
                throw new Error('El producto no existe');
            }

            try {
                await Product.findOneAndDelete({ reference });
                return "Producto eliminado correctamente";
            } catch (error) {
                console.log(error);
            }
        },

        editProduct: async (_, { input }) => {
            const { reference } = input;

            let product = await Product.findOne({ reference });
            if (!product) {
                throw new Error('El producto no existe');
            }

            try {
                product = await Product.findOneAndUpdate({ reference }, input, { new: true});
                return product;
            } catch (error) {
                console.log(error);
            }
           
        },

        createCustomer: async (_, { input }) => {
            const { document, email  } = input;
            
            const documentExists = await Customer.findOne({ document });
            if (documentExists) {
                throw new Error('El documento ya se encuentra registrado');
            }

            const emailExists = await Customer.findOne({ email });
            if (emailExists) {
                throw new Error('El correo ya se encuentra registrado');
            }

            try {
                const customer = new Customer(input);
                customer.save();
                return customer;
            } catch (error) {
                console.log(error);
            }
        },

        deleteCustomer: async (_, { input }) => {
            const { document } = input;
            
            const customerExists = await Customer.findOne({ document });
            if (!customerExists) {
                throw new Error('El cliente no existe');
            }

            try {
                await Customer.findOneAndDelete({ document });
                return "Cliente eliminado correctamente";
            } catch (error) {
                console.log(error);
            }
        },

        editCustomer: async (_, { input }) => {
            const { document } = input;

            let customer = await Customer.findOne({ document });
            if (!customer) {
                throw new Error('El cliente no existe');
            }

            try {
                customer = await Customer.findOneAndUpdate({ document }, input, { new: true });
                return customer;
            } catch (error) {
                console.log(object)
            }
        },

        createSale: async (_, { input }) => {
            const { customer } = input;

            const customerExists = await Customer.findOne({ document: customer });
            if (!customerExists) {
                throw new Error('El cliente no existe');
            }

            for await ( const item of input.sale ){
                // console.log(item)
                const { reference } = item;

                const product = await Product.findOne({ reference });

                if ( item.units > product.units ) {
                    throw new Error(`El artículo ${product.name} excede la cantidad disponible`);
                } else {
                    product.units = product.units - item.units;

                    await product.save();
                }
            }

            input.customer = customerExists._id;
            customerExists.total = customerExists.total + input.total;
            customerExists.save();

            try {
                const sale = new Sale(input);
                await sale.save();
                
                return sale;
            } catch (error) {
                console.log(error);
            }
            
        }

    }
}

module.exports = resolvers;