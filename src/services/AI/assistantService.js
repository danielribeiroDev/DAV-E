
export default class AssistantService {
    constructor ({
        assistantRepository, 
    }) {
        this.assistantRepository = assistantRepository
    }

    async getAll() {
        return await this.assistantRepository.getAll()
    }

    async create({
        name,
        description
    }) {
        return await this.assistantRepository.create({ name, description}) 
    }

    async attachCollections({ 
        id, 
        collections
    }) {
        return await this.assistantRepository.attachCollections({ id, collections })
    }

    async getAttachedCollections({
        id
    }) {
        return await this.assistantRepository.getAttachedCollections({ id })
    }

    async getAvailableCollections({ 
        id 
    }) {
        return await this.assistantRepository.getAvailableCollections({ id })
    }
}