import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { formatToolName } from "../../services/helpers.js";


///:: generate an angent instance that can answer question based in available data
const gAgentInstance = async ({
    collections
}) => {
    const tools = []
    const imageRetrievers = []

    ///:: pass by each collection and create a retriever tool for media search to future queries
    for(let collection of collections) {
        const retriever = collection.vcollection.asRetriever()

        const retrieverTool = createRetrieverTool(retriever, {
            name: formatToolName(collection.name) ,
            description: collection.description
        })
        tools.push(retrieverTool)

        const imageRetrieval = collection.vcollection.asRetriever(1, { type: "image" })
        imageRetrievers.push(imageRetrieval)
    }

    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "Você é um assistente prestativo. Responda as perguntas feitas a você, mantenha o escopo da pergunta e responda somente aquilo que foi perguntado. Não entre em tópicos ou termos que não se relacionam diretamente com a pergunta. Caso não saiba a resposta, diga que não sabe."),
        new MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
        new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const llm = new ChatOpenAI({
        model: "gpt-3.5-turbo",
        temperature: 0
    })

    const agent = await createOpenAIFunctionsAgent({
        llm,
        tools,
        prompt
    })

    const agentExecutor = new AgentExecutor({
        agent,
        tools
    })

    return { agentExecutor, imageRetrievers }
}

export {
    gAgentInstance
}