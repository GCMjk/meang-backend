import { IResolvers } from '@graphql-tools/utils';
import { COLLECTIONS } from './../config/constants';

import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
    Mutation: {
        async register(_, { user }, { db }) {

            // Check that the user does not exist
            const userCheck = await db.collection(COLLECTIONS.USERS)
                    .findOne({ email: user.email });

            if (userCheck !== null) {
                return {
                    status: false,
                    message: `The email ${user.email} is registered and you cannot register with this email`,
                    user: null
                };
            }

            // Check the last registered user to assign the ID
            const lastUser = await db.collection(COLLECTIONS.USERS).
                                find().
                                limit(1).
                                sort({ registerDate: -1 }).toArray();

            if (lastUser.length === 0) {
                user.id = 1;
            } else {
                user.id = lastUser[0].id + 1;
            }
            // Assign the date in ISO format in the registerDate property
            user.registerDate = new Date().toISOString();

            // Encrypt password
            user.password = bcrypt.hashSync(user.password, 10);

            // Save the document (record) in the collection
            return await db.
                collection(COLLECTIONS.USERS).
                insertOne(user).then(
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

export default resolversMutation;