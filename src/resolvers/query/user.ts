import { IResolvers } from '@graphql-tools/utils';
import UsersService from '../../services/users.service';

const resolversUserQuery: IResolvers = {
    Query: {

        // User collection list
        async users(_, { page, itemsPage }, context) {
            return new UsersService(_, {
                pagination: { page, itemsPage }
            }, context).items();
        },

        // Login with email and encrypted password
        async login(_, { email, password }, context) {
            return new UsersService(_, { user: { email, password }}, context).login();
        },

        // Token verification
        me(_, __, { token }) {
            return new UsersService(_, __, {token}).auth();
        }

    },
};

export default resolversUserQuery;