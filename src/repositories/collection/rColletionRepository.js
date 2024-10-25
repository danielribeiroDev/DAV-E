
///:: handle the relational db interface - relative to collection operations
export default class rCollectionRepository {
    constructor({ db }) {
        this.db = db,
        this.table = 'collections'
    }

    async getAll({ userId }) {
        const findAllQuery = `
        SELECT * FROM ${this.table}
        WHERE user_id = $1
        `
        const result = await this.db.query(findAllQuery, [userId])
        return result.rows
    }

    async create({ collectionName, description, userId }) {
        const createCollectionQuery = `
            INSERT INTO ${this.table} (name, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    
        try {
            const result = await this.db.query(createCollectionQuery, [collectionName, description, userId]);
            return result.rows[0]; 
        } catch (error) {
            console.error('Erro ao criar a coleção:', error);
            throw error;
        }
    }

    async delete({ id }) {
        const deleteCollectionQuery = `
        DELETE collection FROM ${this.table}
        WHERE collection.id = $1
        `

        try {
            const result = await this.db.query(deleteCollectionQuery, [id])
            return result.rows[0]

        } catch (error) {
            console.error('Erro ao deletar coleção', error)
            throw error
        }
    }

    async addFile({ collectionId, date, description, name}) {
        const createFileQuery = `
            INSERT INTO files (collection_id, date, description, name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `
        try {
            const result = await this.db.query(createFileQuery, [collectionId, date || new Date(), description, name])
            return result.rows[0];
        } catch(error) {
            console.error('Erro ao criar a coleção:', error);
            throw error;
        }
    }

    async getAllFiles({ collectionId }) {
        const getAllFilesQuery = `
            SELECT * FROM files WHERE collection_id = $1;
        `

        try {
            const result = await this.db.query(getAllFilesQuery, [collectionId])
            return result.rows
        } catch(error) {
            console.error('Erro ao buscar arquivos', error);
            throw error;
        }
        
    }
}