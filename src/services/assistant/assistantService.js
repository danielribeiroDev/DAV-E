
///:: the midfield between assistant controllers and repositories
export default class AssistantService {
    constructor ({
        assistantRepository, 
    }) {
        this.assistantRepository = assistantRepository
    }

    async getAll({ userId }) {
        return await this.assistantRepository.getAll({ userId })
    }

    async create({
        name,
        description,
        userId
    }) {
        return await this.assistantRepository.create({ name, description, userId}) 
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
        id,
        userId
    }) {
        return await this.assistantRepository.getAvailableCollections({ id, userId })
    }
}