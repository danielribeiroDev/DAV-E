
///:: the midfield between relational collection controllers and repositories
export default class rCollectionService {
    constructor({
        rcollectionRepository
    }) {
        this.collectionRepository = rcollectionRepository
    }

    async create({ collectionName,  description, userId}) {
        const rcollection = await this.collectionRepository.create({ collectionName, description, userId })

        return {
            id: rcollection.id,
            name: rcollection.name
        }
    }

    async delete({ id }) {
        await this.collectionRepository.delete({ id })
    }

    async addFile({ collectionId, date, description , name }) {
        const rfile = await this.collectionRepository.addFile({ collectionId, date, description , name })

        return {
            name: rfile.name,
            id: rfile.id,
            date: rfile.date,
            collectionId: rfile.collection_id
        }
    }

    async getAll({ userId }) {
        return await this.collectionRepository.getAll({ userId })
    }

    async getAllFiles({ collectionId }) {
        return await this.collectionRepository.getAllFiles({ collectionId })
    }
}