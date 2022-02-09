import ResolversOperationsService from './resolvers-operations.service';
import { IContextData } from '../interfaces/context-data.interface';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from '../config/constants';

import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';

import { assignDocumentId, findOneElement } from '../lib/db-operations';

class UsersService extends ResolversOperationsService {

    private collection = COLLECTIONS.USERS;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }

    // User list
    async items() {
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        const result = await this.list(this.collection, 'usuarios', page, itemsPage);
        return {
            info: result.info,
            status: result.status,
            message: result.message,
            users: result.items
        };
    }

    // Authentication
    async auth() {
        let info = new JWT().verify(this.getContext().token!);

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

    // Login
    async login() {
        try {
            const variables = this.getVariables().user;
            // Search for registration in the user collection, by mail
            const user = await findOneElement(this.getDb(), this.collection, { email: variables?.email });

            if (user === null) {
                return {
                    status: false,
                    message: 'The users email does not exist',
                    token: null
                };
            }

            const passwordCheck = bcrypt.compareSync(variables?.password || '', user.password || '');
            
            if (passwordCheck !== null) {
                delete user.password;
                delete user.birthday;
                delete user.registerDate;
            }

            return {
                status: passwordCheck,
                message: 
                    !passwordCheck
                        ? 'Incorrect user data, session not started' 
                        : 'User successfully loaded',
                token: 
                    !passwordCheck
                        ? null
                        : new JWT().sign({ user }, EXPIRETIME.H24),
                user:
                    !passwordCheck
                        ? null
                        : user,
            };

        } catch (error) {

            console.log(error);
            return {
                status: false,
                message: 'Error loading user, check the information again',
                token: null
            };

        }
    }

    // Register users
    async register() {
        const user = this.getVariables().user;

        // Check that user is not null
        if (user === null) {
            return {
                status: false,
                message: 'Usuario no definido.',
                user: null
            };
        }

        if (user?.password === null ||
            user?.password === undefined ||
            user?.password === '') {
                return {
                    status: false,
                    message: 'Usuario sin password correcto',
                    user: null
                };
        }

        // Check that the user's email does not exist
        const userCheck = await findOneElement(this.getDb(), this.collection, {email: user?.email});
        if (userCheck !== null) {
            return {
                status: false,
                message: `The email ${user?.email} is registered and you cannot register with this email`,
                user: null
            };
        }

        // Check the last registered user to assign the ID
        user!.id = await assignDocumentId(this.getDb(), this.collection, { registerDate: -1 });

        // Assign the date in ISO format in the registerDate property
        user!.registerDate = new Date().toISOString();

        // Encrypt password
        user!.password = bcrypt.hashSync(user!.password, 10);

        const result = await this.add(this.collection, user || {}, 'usuario');
        // Save the document to the user collection
        return {
            status: result.status,
            message: result.message,
            user: result.item
        };
    }

    // Modify a user
    async modify() {
        const user = this.getVariables().user;
        if (user === null) {
            return {
                status: false,
                message: 'Usuario no definido.',
                user: null
            };
        }
        const filter = { id: user?.id };
        const result = await this.update(this.collection, filter, user || {}, 'usuario');
        return {
            status: result.status,
            message: result.message,
            user: result.item
        };
    }

    // Delete a user
    async delete() {
        const id = this.getVariables().id;
        if (id === undefined || id === '') {
            return {
                status: false,
                message: 'Identificador del usuario no definido, obligatorio definirlo para eliminar el usuario',
                user: null
            };
        }
        const result = await this.del(this.collection, { id }, 'usuario');
        return {
            status: result.status,
            message: result.message
        };
    }
}

export default UsersService;