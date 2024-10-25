
///:: handle the db interface - relative to chat operations
export default class ChatRepository {
    constructor ({
        db
    }) {
        this.db = db
    }

    async create({
        name,
        id,
        userId
    }) {
        const createChatQuery = 
        `
        INSERT INTO chats (name, assistant_id, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
        `

        try {
            const result = await this.db.query(createChatQuery, [name, id, userId])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao criar chat', error)
            throw error;
        }
    }

    async getAll({ userId }) {
        const getAllQuery = 
        `
        SELECT * FROM chats
        WHERE $1 = chats.user_id;
        `

        try {
            const result = await this.db.query(getAllQuery, [userId])
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

    async updateChatName({ id, name }) {
        const updateQuery = 
        `
        UPDATE chats
        SET name = $2
        WHERE id = $1
        RETURNING *;
        `

        try {
            const result = await this.db.query(updateQuery, [id, name])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao atualizar chat', error)
            throw error;
        }
    }
}