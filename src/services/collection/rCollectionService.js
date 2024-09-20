
///:: the midfield between relational collection controllers and repositories
export default class rCollectionService {
    constructor({
        rcollectionRepository
    }) {
        this.collectionRepository = rcollectionRepository
    }

    async create({ collectionName,  description}) {
        const rcollection = await this.collectionRepository.create({ collectionName, description })

        return {
            id: rcollection.id,
            name: rcollection.name
        }
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

    async getAll() {
        return await this.collectionRepository.getAll()
    }

    async getAllFiles({ collectionId }) {
        return await this.collectionRepository.getAllFiles({ collectionId })
    }
}