
///:: the midfield between vectorial collection controllers and repositories
export default class vCollectionService {
    constructor({
        vcolletionRepository
    }) {
        this.collectionRepository = vcolletionRepository
    }

    async create({ id }) {
        const vcollection = await this.collectionRepository.create({ id })

        return {
            id: vcollection.collectionName,
        }
    }

    async delete({ id }) {
        await this.collectionRepository.delete({ id })
    }

    async get({ id }) {
        return await this.collectionRepository.get({ id })
    }

    async addFile({ doc, collectionId }) {
        return await this.collectionRepository.addFile({ doc, collectionId })
    }
}