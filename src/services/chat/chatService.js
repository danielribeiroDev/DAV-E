import { gAgentInstance } from "../../factories/agent/agentFactory.js"
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { scoreImage, insertImage } from "../../AI/chains/relativeImage.js";
import { verifyQuestion } from "../../AI/chains/verify.js";


///:: the midfield between chat controllers and repositories
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

    ///:: create a chat
    async create({
        name,
        id,
        userId
    }) {
        const chat = await this.chatRepository.create({ name, id, userId }) 
        
        return chat
    }

    ///:: get all chats
    async getAll({ userId }) {
        return await this.chatRepository.getAll({ userId })
    }

    ///:: get specific chat
    async get({
        id
    }) {
        return await this.chatRepository.get({ id })
    }

    ///:: answer a question
    async answer({ question, id }) {
        let agent = this.memcached.get('agents', id)
        if(!agent)
            agent = await this._createAgentForChat({ id })

        const verified = await verifyQuestion({ question })
        if(!verified.isSollution) {
            const result = await agent.agentExecutor.invoke({
                input: question,
                chat_history: this.memcached.get('chat_history', id) || this.memcached.add('chat_history', id, [])
            })

            const answer = result.output
            ///:: Search for relative images
            const relativeImages =  await this._searchForRelativeImages({ imageRetrievers: agent.imageRetrievers, question })
            
            const relevantImages = []
            for(let image of relativeImages) {
                const score = await scoreImage({ question, image: image.desc })
                if(score >= 7)
                    relevantImages.push(image)
            }

            for(let image of relevantImages) {
                const line = await insertImage({ text: answer, image: image.desc })
                image.line = line
            }
            
            this.memcached.append('chat_history', id, new HumanMessage(result.input))
            this.memcached.append('chat_history', id, new AIMessage(answer))

            return { answer, relativeImages: relevantImages, chatName:  await this.updateChatName({ id, question })}
        }
        
        

        return { answer: verified.feedback, relativeImages: [] }
    }
    
    /* ---INTERNAL METHODS--- */ 

    ///:: create an agent
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

    ///:: search for relevant images 
    async _searchForRelativeImages({ imageRetrievers, question }) {
        const relativeImages = []
        let cont = 0
        for(let retriever of imageRetrievers) {
            cont++
            const result = await retriever.invoke(question)
            if(result.length > 0) {
                relativeImages.push(
                    {
                        id: cont,
                        desc: result[0].pageContent,
                        source: result[0].metadata.source
                    }
                )
            }
        }

        return relativeImages
    }

    async updateChatName({ id, question }) {
        const chat = await this.get({ id })
        if(chat.name === 'New chat') {
            chat.name = question.slice(0,10)
            await this.chatRepository.updateChatName({ id, name: chat.name })
        }
        return chat.name
    }
}