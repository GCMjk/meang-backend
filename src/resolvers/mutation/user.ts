import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS } from './../../config/constants';

import bcrypt from 'bcrypt';

import { assignDocumentId, findOneElement, insertOneElement } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
    Mutation: {

        // User registration: email verification, ID assignment, date to ISO format, encrypted password
        async register(_, { user }, { db }) {

            // Check that the user's email does not exist
            const userCheck = await findOneElement(db, COLLECTIONS.USERS, {email: user.email});
            if (userCheck !== null) {
                return {
                    status: false,
                    message: `The email ${user.email} is registered and you cannot register with this email`,
                    user: null
                };
            }

            // Check the last registered user to assign the ID
            user.id = await assignDocumentId(db, COLLECTIONS.USERS, { registerDate: -1 });

            // Assign the date in ISO format in the registerDate property
            user.registerDate = new Date().toISOString();

            // Encrypt password
            user.password = bcrypt.hashSync(user.password, 10);

            // Save the document to the user collection
            return await insertOneElement(db, COLLECTIONS.USERS, user)
                .then(
                    async () => {
                        return {
                            status: true,
                            message: `The email ${user.email} is registered correctly`,
                            user
                        };
                    }
                ).catch((err: Error) => {
                    console.log(err.message);
                    return {
                        status: true,
                        message: `Unexpected error, try again`,
                        user: null
                    };
                });
            
        }

    }
};

export default resolversUserMutation;