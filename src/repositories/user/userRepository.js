export default class UserRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async create({
        name,
        email,
        hashedPassword
    }) {
        const createUserQuery = 
        `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
        `

        try {
            const result = await this.db.query(createUserQuery, [name, email, hashedPassword])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao criar Usuário', error)
            throw error;
        }
    }

    async get({
        id
    }) {
        const getQuery = 
        `
        SELECT * FROM users user
        WHERE $1 = user.id

        `

        try {
            const result = await this.db.query(getQuery, [id])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao recuperar usuário', error)
            throw error;
        }
    }

    async getByEmail({
        email
    }) {
        const getQuery = 
        `
        SELECT * FROM users
        WHERE $1 = email

        `

        try {
            const result = await this.db.query(getQuery, [email])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao recuperar usuário', error)
            throw error;
        }
    }
}