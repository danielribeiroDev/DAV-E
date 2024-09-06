import AssistantRepository from "../repositories/assistantRepository.js";
import AssistantService from "../services/AI/assistantService.js";

const gAssistantServiceInstance = ({
    db
}) => {
    const assistantRepository = new AssistantRepository({ db })
    const assistantService = new AssistantService({
        assistantRepository
    })

    return assistantService
}

export {
    gAssistantServiceInstance
}