import vCollectionRepository from "../../repositories/collection/vCollectionRepository.js";
import vCollectionService from "../../services/collection/vCollectionService.js";

///:: generate a vectorial collection service instance
const gvCollectionServiceInstance = (
    { 
        provider, url, hnsw_space, embeddingHanldeObject 
    }
) => {
    const vcolletionRepository = new vCollectionRepository({
        provider, url, hnsw_space, embeddingHanldeObject
    })

    const vcollectionService = new vCollectionService({
        vcolletionRepository
    })

    return vcollectionService
}

export {
    gvCollectionServiceInstance
}