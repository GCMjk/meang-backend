import { IResolvers } from '@graphql-tools/utils';
import UsersService from '../../services/users.service';

const resolversUserMutation: IResolvers = {
    Mutation: {

        // User registration: email verification, ID assignment, date to ISO format, encrypted password
        async register(_, { user }, context) {
            return new UsersService(_, { user }, context).register();
        },

        // Update a user's data
        async updateUser(_, { user }, context) {
            return new UsersService(_, { user }, context).modify();
        },

        // Delete a user
        async deleteUser(_, { id }, context) {
            return new UsersService(_, { id }, context).delete();
        }

    }
};

export default resolversUserMutation;