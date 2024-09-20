
///:: handle the vectorial db interface - relative to collection operations
export default class vCollectionRepository {
    constructor({ provider, url, hnsw_space, embeddingHanldeObject }) {
        this.provider = provider,
        this.url = url,
        this.hnsw_space = hnsw_space,
        this.embeddingHanldeObject = embeddingHanldeObject
    }
    
    async create({ id }) {
        return await this.provider.fromDocuments([], this.embeddingHanldeObject, {
            collectionName: id,
            url: this.url,
            collectionMetadata: {
                "hnsw:space": this.hnsw_space,
            },
        })
    }

    async get({ id, filter = {} }) {
        const vcollection =  await this.provider.fromExistingCollection(
            this.embeddingHanldeObject,
            {
                collectionName: id,
                filter: filter
                  
            }
        )

        return vcollection
    }

    async addFile({ doc, collectionId }) {
        const vectorstore = await this.get({ id: collectionId })
        const result = await vectorstore.addDocuments(doc)
        return result
    }
}