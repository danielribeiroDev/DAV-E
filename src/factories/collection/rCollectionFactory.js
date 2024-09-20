import rCollectionRepository from "../../repositories/collection/rColletionRepository.js";
import rCollectionService from "../../services/collection/rCollectionService.js";

///:: generate a relational collection service instance
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