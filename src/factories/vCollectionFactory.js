import vCollectionRepository from "../repositories/collection/vCollectionRepository.js";
import vCollectionService from "../services/AI/collection/vCollectionService.js";

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