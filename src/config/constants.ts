import environment from './environments';

if(process.env.NODE_ENV !== 'production'){
    const env = environment;
}

export const SECRET_KEY = process.env.SECRET || 'BackendAPI_21';

export enum COLLECTIONS {
    USERS='users'
}

export enum MESSAGES {
    TOKEN_VERIFICATION_FAILDED = 'Invalid token, log in again'
}

/**
 * H = Hours
 * M = Minutes
 * D = Days
 */
export enum EXPIRETIME {
    H1 = 60 * 60,
    H24 = 24 * H1,
    M15 = H1 / 4,
    M20 = H1 / 3,
    D3 = H24 * 3
}