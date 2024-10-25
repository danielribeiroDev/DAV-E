import jwt from 'jsonwebtoken';

import pkg from 'bcryptjs';
const { hash, compare } = pkg;

export default class AuthService {

    generateToken({ id }) {
        const token = jwt.sign({ id }, 'secret');
        return token
    }

    async hashPassword({ password }) {
        const hashedPassword = await hash(password, 10);
        return hashedPassword
    }

    async matchPasswod({ password, userPassword }) {
        const result = await compare(password, userPassword)
        return result
    }
}