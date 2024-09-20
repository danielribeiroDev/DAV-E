import ChatRepository from "../../repositories/chat/chatRepository.js";
import ChatService from "../../services/chat/chatService.js";

///:: generate an chat service instance
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