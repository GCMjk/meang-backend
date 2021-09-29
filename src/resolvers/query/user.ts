import { IResolvers } from '@graphql-tools/utils';
import JWT from './../../lib/jwt';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../../config/constants';

import bcrypt, { hash } from 'bcrypt';

import { findOneElement, findElements } from './../../lib/db-operations';

const resolversUserQuery: IResolvers = {
    Query: {

        // User collection list
        async users(_, __, { db }) {

            try {
                
                return {
                    status: true,
                    message: 'User list loaded successfully',
                    users: await findElements(db, COLLECTIONS.USERS)
                };

            } catch (error) {

                console.log(error);
                return {
                    status: false,
                    message: 'Error loading users, check the information again',
                    users: []
                };

            }

        },

        // Login with email and encrypted password
        async login(_, { email, password }, { db }) {
            try {

                // Search for registration in the user collection, by mail
                const user = await findOneElement(db, COLLECTIONS.USERS, { email });

                if (user === null) {
                    return {
                        status: false,
                        message: 'The users email does not exist',
                        token: null
                    };
                }

                const passwordCheck = bcrypt.compareSync(password, user.password);
                
                if (passwordCheck !== null) {
                    delete user.password;
                    delete user.birthday;
                    delete user.registerDate;
                }

                return {
                    status: true,
                    message: 
                        !passwordCheck
                            ? 'Incorrect user data, session not started' 
                            : 'User successfully loaded',
                    token: 
                        !passwordCheck
                            ? null
                            : new JWT().sign({ user }, EXPIRETIME.H24)
                };

            } catch (error) {

                console.log(error);
                return {
                    status: false,
                    message: 'Error loading user, check the information again',
                    token: null
                };

            }

        },

        // Token verification
        me(_, __, { token }) {

            let info = new JWT().verify(token);

            if (info === MESSAGES.TOKEN_VERIFICATION_FAILDED) {
                return {
                    status: false,
                    message: info, 
                    user: null
                };
            }
            return {
                status: true,
                message: 'User authenticated by token successfully',
                user:  Object.values(info)[0]
            };

        }

    },
};

export default resolversUserQuery;