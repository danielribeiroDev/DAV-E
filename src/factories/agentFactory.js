
import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { formatToolName } from "../services/platform/helpers.js";


const gAgentInstance = async ({
    collections
}) => {
    const tools = []
    for(let collection of collections) {
        const retriever = collection.vcollection.asRetriever()

        const retrieverTool = createRetrieverTool(retriever, {
            name: formatToolName(collection.name) ,
            description: collection.description
        })
        tools.push(retrieverTool)
    }
    const prompt = ChatPromptTemplate.fromMessages([
        ("system", "Você é um assistente prestativo. Responda as perguntas feitas a você, mantendo o escopo da pergunta e responda somente aquilo que foi perguntado"),
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

    return agentExecutor
}

export {
    gAgentInstance
}