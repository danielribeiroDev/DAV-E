import AssistantRepository from "../../repositories/assistant/assistantRepository.js";
import AssistantService from "../../services/assistant/assistantService.js";

///:: generate an assistance service instance
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