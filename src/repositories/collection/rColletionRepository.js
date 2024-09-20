
///:: handle the relational db interface - relative to collection operations
export default class rCollectionRepository {
    constructor({ db }) {
        this.db = db,
        this.table = 'collections'
    }

    async getAll() {
        const findAllQuery = `SELECT * FROM ${this.table}`
        const result = await this.db.query(findAllQuery)
        return result.rows
    }

    async create({ collectionName, description }) {
        const createCollectionQuery = `
            INSERT INTO ${this.table} (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `;
    
        try {
            const result = await this.db.query(createCollectionQuery, [collectionName, description]);
            return result.rows[0]; // Retorna o elemento recém-criado
        } catch (error) {
            console.error('Erro ao criar a coleção:', error);
            throw error;
        }
    }

    async addFile({ collectionId, date, description, name}) {
        const createFileQuery = `
            INSERT INTO files (collection_id, date, description, name)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `
        try {
            const result = await this.db.query(createFileQuery, [collectionId, date || new Date(), description, purpose, name])
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