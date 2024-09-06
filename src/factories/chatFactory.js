import ChatRepository from "../repositories/chatRepository.js";
import ChatService from "../services/platform/chatService.js";

const gChatServiceInstance = ({
    db,
    assistantService,
    vcollectionService,
    memcached
}) => {
    const chatRepository = new ChatRepository({ db })
    const chatService = new ChatService({
        chatRepository,
        assistantService,
        vcollectionService,
        memcached
    })

    return chatService
}

export {
    gChatServiceInstance
}