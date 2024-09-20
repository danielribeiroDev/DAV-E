
///:: handle the db interface - relative to assistant operations
export default class AssistantRepository {
    constructor({
        db
    }) {
        this.db = db
    }

    async getAll() {
        
        const findAllQuery = `SELECT * FROM assistants`
        const result = await this.db.query(findAllQuery)
        return result.rows
    }

    async create({
        name, 
        description
    }) {
        const createAssistantQuery = 
        `
        INSERT INTO assistants (name, description, collections)
        VALUES ($1, $2, $3)
        RETURNING *;
        `

        try {
            const result = await this.db.query(createAssistantQuery, [name, description, `{ "collections": [] }`])
            return result.rows[0]
        } catch (error) {
            console.error('Erro ao criar assistente', error);
            throw error;
        }
    }

    /// attach an collection to assistant
    async attachCollections({ id, collections }) {
        try {

            const insertIntoAssistantsCollections = 
            `
            INSERT INTO assistants_collections (assistant_id, collection_id)
            VALUES ($1, $2)
            `
            let attachedCollections = []
            collections.forEach( async colletionId => {
               const result =  await this.db.query(insertIntoAssistantsCollections, [id, colletionId])
               attachedCollections.push(result.rows[0])
            });


            return attachedCollections
        } catch (error) {
            console.error('Erro ao adicionar coleção ao assistente', error);
            throw error;
        }
    }

    ///:: get all assistant attached collections
    async getAttachedCollections({
        id
    }) {
        try {
            const retrieveAttachedCollections = 
            `
            SELECT c.*
            FROM collections c
            JOIN assistants_collections ac ON c.id = ac.collection_id
            WHERE ac.assistant_id = $1;

            `
            const result = await this.db.query(retrieveAttachedCollections, [id])
            return result.rows
        } catch (error) {
            console.error('Erro ao buscar coleções relacionadas ao assistente', error);
            throw error;
        }
    }

    ///:: get all collection that are not yet attached to assistant
    async getAvailableCollections({ 
        id
     }) {
        try {
            const retrieveNotAttachedCollections = 
            `
            SELECT c.*
            FROM collections c
            LEFT JOIN assistants_collections ac ON c.id = ac.collection_id AND ac.assistant_id = $1
            WHERE ac.collection_id IS NULL;

            `

            const result = await this.db.query(retrieveNotAttachedCollections, [id])
            return result.rows
        } catch (error) {
            console.error('Erro ao buscar coleções não relacionadas ao assistente', error);
            throw error;
        }
    }
}