
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});

import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

///:: verify if the question is about a solution that user figure out 
/*
    THAT APPROACH MUST BE REPLACED BY AN AGENT.TOOL
*/
const verifyPrompt = ChatPromptTemplate.fromTemplate(`
    Analise o texto a seguir:
    {question}

    Sua tarefa é verificar se o texto é uma pergunta ou uma solução, identificada pelo prefixo "SOLUÇÃO".

    Retorne:

    SOLUTION se o texto for uma solução
    QUESTION se o texto for uma pergunta

    IMPORTANTE: Retorne somente SOLUTION ou QUESTION. Exemplo: "QUESTION"
    `)


const verifyChain = verifyPrompt.pipe(model).pipe(new StringOutputParser())

///:: verify if quesiton is about a solution that user figure out
async function verifyQuestion({ question }) {
    const result = await verifyChain.invoke({ question })
    const verified = { isSollution: false, feedback: 'Obrigado, agora sei como prosseguir nessa situação.' }
    if(result.toUpperCase() == 'SOLUTION')
        verified.isSollution = true
    return verified
}


export {
    verifyQuestion,
}