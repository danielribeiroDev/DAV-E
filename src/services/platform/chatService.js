import { gAgentInstance } from "../../factories/agentFactory.js"
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export default class ChatService {
    constructor ({
        chatRepository,
        assistantService,
        vcollectionService,
        memcached 
    }) {
        this.chatRepository = chatRepository
        this.assistantService = assistantService
        this.vcollectionService = vcollectionService
        this.memcached = memcached
    }

    async create({
        name,
        id
    }) {
        const chat = await this.chatRepository.create({ name, id }) 
        
        return chat
    }

    async getAll() {
        return await this.chatRepository.getAll()
    }

    async get({
        id
    }) {
        return await this.chatRepository.get({ id })
    }

    /*--- /MESSAGES METHODS ---*/
    async answer({ question, id }) {
        let agent = this.memcached.get('agents', id)
        if(!agent)
            agent = await this._createAgentForChat({ id })
        const result = await agent.invoke({
            input: question,
            chat_history: this.memcached.get('chat_history', id) || this.memcached.add('chat_history', id, [])
        })

        this.memcached.append('chat_history', id, new HumanMessage(result.input))
        this.memcached.append('chat_history', id, new AIMessage(result.output))

        console.log(result)
        return result
    }
    
    /* ---INTERNAL METHODS--- */ 
    async _createAgentForChat({ id }) {
        const chat = await this.get({ id })
        const collections = await this.assistantService.getAttachedCollections({ id: chat.assistant_id })
        const vcollections = []

        for(let collection of collections) {
            const vcollection = await this.vcollectionService.get({ id: collection.id })
            vcollections.push({
                vcollection,
                name: collection.name,
                description: collection.description
            })
        }
        const agent = await gAgentInstance({
            collections: vcollections
        })

        this.memcached.add('agents', chat.id, agent)

        return agent
    }

}