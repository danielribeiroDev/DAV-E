import rCollectionRepository from "../repositories/collection/rColletionRepository.js";
import rCollectionService from "../services/AI/collection/rCollectionService.js";

const grCollectionServiceInstance = ({
    db
}) => {

    const rcollectionRepository = new rCollectionRepository({
        db,
        table: "collections"
    })

    const rcollectionService = new rCollectionService({
        rcollectionRepository
    })

    return rcollectionService
}

export {
    grCollectionServiceInstance
}