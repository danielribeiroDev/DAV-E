
export default class ChatRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async create({
        name,
        id
    }) {
        const createChatQuery = 
        `
        INSERT INTO chats (name, assistant_id)
        VALUES ($1, $2)
        RETURNING *;
        `

        try {
            const result = await this.db.query(createChatQuery, [name, id])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao criar chat', error)
            throw error;
        }
    }

    async getAll() {
        const getAllQuery = 
        `
        SELECT * FROM chats
        `

        try {
            const result = await this.db.query(getAllQuery)
            return result.rows
        } catch (error) {
            console.error('Erro ao recuperar chat', error)
            throw error;
        }
    }

    async get({
        id
    }) {
        const getQuery = 
        `
        SELECT 
            chats.*, 
            assistants.name, 
            assistants.id
        FROM chats
        JOIN assistants ON chats.assistant_id = assistants.id
        WHERE $1 = chats.id;

        `

        try {
            const result = await this.db.query(getQuery, [id])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao recuperar chat', error)
            throw error;
        }
    }
}