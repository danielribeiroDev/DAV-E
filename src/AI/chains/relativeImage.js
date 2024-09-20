
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({
  model: "gpt-4-turbo",
  temperature: 0
});

///:: defines the relvance of a image face a question
const analysisPrompt = ChatPromptTemplate.fromTemplate(`
    Analise a descrição da imagem fornecida: {image}

    Sua tarefa é determinar o quanto essa imagem é relevante para responder à seguinte pergunta:
    {question}

    Retorne uma nota de 0 a 10, onde:

    0 = Totalmente irrelevante
    10 = Extremamente relevante

    IMPORTANTE: Retorne somente a nota e nada mais
    `)


///:: insert image in properly local in text
const insertprompt = ChatPromptTemplate.fromTemplate(`
        Analise o texto a seguir, que é uma resposta para uma pergunta:
{text}

Sua tarefa é identificar o local mais adequado para inserir a imagem fornecida:
{image}

Retorne o número da linha onde a imagem deve ser colocada para melhorar a compreensão e fluidez do texto.

IMPORTANTE: Retorne somente o número da linha e nada mais (Exemplo: "2")
    `);

const analysisChain = analysisPrompt.pipe(model).pipe(new StringOutputParser())

const insertChain = insertprompt.pipe(model).pipe(new StringOutputParser());


///:: defines the relvance of a image face a question and return a score
async function scoreImage({ question, image }) {
    const score = await analysisChain.invoke({ question, image })
    return Number(score)
}

///:: insert image in properly local in text
async function insertImage({ text, image }) {
    const line = await insertChain.invoke({ text, image  })
    return Number(line)
}

export {
    scoreImage,
    insertImage
}