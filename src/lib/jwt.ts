import { IJwt } from './../interfaces/jwt.interface';
import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';

class JWT {
    private secretKey = SECRET_KEY as string;

    // Payload information with a default expiration date of 24 hours
    sign(data: IJwt, expiresIn: number = EXPIRETIME.H24) {
        return jwt.sign(
            { user: data.user },
            this.secretKey,
            { expiresIn } 
        );
    }

    verify( token: string ) {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (e) {
            return MESSAGES.TOKEN_VERIFICATION_FAILDED;
        }
    }

}

export default JWT;