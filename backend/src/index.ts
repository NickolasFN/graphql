import { Sequelize } from 'sequelize';
import { initModels, product, orderdetail, order, productCreationAttributes, orderCreationAttributes, orderdetailCreationAttributes } from "./models/init-models";
import * as dotenv from 'dotenv';
import { ApolloServer, gql } from 'apollo-server';
import { readFileSync } from 'fs';

const typeDefs = readFileSync("./src/product.graphql").toString('utf-8');
dotenv.config();

const sequelize = new Sequelize(
	process.env.DB_NAME as string,
	process.env.DB_USER as string,
	process.env.DB_PASS as string, {
	host: process.env.DB_HOST as string,
	dialect: 'mysql'
});

// import models into sequelize instance
initModels(sequelize);

const resolvers = {
	Query: {
		products: async () => await product.findAll(),
		orders: async () => await order.findAll(),
		orderdetails: async () => await orderdetail.findAll()
	},
	Mutation: {
		// product
		GetDetailProduct: async (_parent: any, args: any) => {
			return await product.findByPk(args.id);
		},
		CreateProduct: async (_parent: any, args: any) => {
			const now = new Date();

			const newProduct: productCreationAttributes = {
				name: args.name,
				stock: args.stock,
				price: args.price,
				created: now

			}
			return await product.create(newProduct);
		},
		UpdateProduct: async (_parent: any, args: any) => {
			return await product.update({
				name: args.name,
				stock: args.stock,
				price: args.price,
			}, {
				where: {
					id: args.id
				}
			})
		},
		DeleteProduct: async (_parent: any, args: any) => {
			return await product.destroy({
				where: {
					id: args.id
				}
			})
		},

		// Order
		GetDetailOrder: async (_parent: any, args: any) => {
			return await order.findByPk(args.id);
		},
		
		CreateOrder: async (_parent: any, args: any) => {
			const now = new Date();

			const newOrder: orderCreationAttributes = {
				transcode : args.transcode,
				created: now
			}
			return await order.create(newOrder);
		},

		// orderdetail
		
	}
};



const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});