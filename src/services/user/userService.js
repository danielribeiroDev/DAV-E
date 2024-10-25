import { NotFoundError } from "openai"

export default class UserService {
    constructor ({
        userRepository, 
        authService
    }) {
        this.userRepository = userRepository,
        this.authService = authService
    }

    async create({
        name,
        email,
        password
    }) {
        const alreadyUser = await this.getByEmail({ email })
        if(alreadyUser)
            throw new Error('User already exists')
        const hashedPassword = await this.authService.hashPassword({ password })
        const user = await this.userRepository.create({ name, email, hashedPassword}) 
        return { 
            id: user.id, 
            email: user.email, 
            name: user.name 
        }
    }

    async get({ id }) {
        const user = await this.userRepository.get({ id })
        return { 
            id: user.id, 
            email: user.email, 
            name: user.name 
        }
    }

    async getByEmail({ email }) {
        const user = await this.userRepository.getByEmail({ email })
        if(!user)
            return null
        return { 
            id: user.id, 
            email: user.email, 
            name: user.name 
        }
    }
    
    async authenticate({ email, password }) {
        const user = await this.userRepository.getByEmail({ email })
        if(!user)
            throw new NotFoundError('User not found')
        const match = await this.authService.matchPasswod({ password, userPassword: user.password })
        if(!match)
            throw new Error('Invalid password')
        const token = this.authService.generateToken({ id: user.id })
        return { 
            id: user.id, 
            email: user.email, 
            name: user.name,
            token
        }
    }
}