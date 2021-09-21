import { IResolvers } from '@graphql-tools/utils';
import JWT from '../lib/jwt';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from './../config/constants';

import bcrypt, { hash } from 'bcrypt';

const resolversQuery: IResolvers = {
    Query: {

        async users(_, __, { db }) {
            try {
                return {
                    status: true,
                    message: 'User list loaded successfully',
                    users: await db.collection(COLLECTIONS.USERS).find().toArray()
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

        async login(_, { email, password }, { db }) {
            try {

                const user = await db
                    .collection(COLLECTIONS.USERS)
                    .findOne({ email });

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

export default resolversQuery;