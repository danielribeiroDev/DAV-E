import { initializeDatabase } from "./src/database.js";
import csv from 'csv-parser';
import fs from 'node:fs';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import OpenAI from "openai";

/// :: Fill database with AI 

const credentials = {
    user: 'ADMIN',
    host: 'localhost', // Use 'localhost' se estiver fora do Docker ou 'postgres' se estiver na rede Docker
    database: 'postgres',
    password: 'ADMIN',
    port: 5432,
};

const db = initializeDatabase({ credentials });

const openai = new OpenAI({
    apiKey: ''
});

const results = [];

fs.createReadStream('SOFFTEK database.xlsx - Plan1.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push(data);
    })
    .on('end', async () => {
        if (results.length === 0) {
            console.log('Nenhum dado foi processado.');
            return;
        }

        await Promise.all(results.map(async (data) => {
            await openAIClassification(data);
        }));

        const csvWriter = createCsvWriter({
            path: 'output.csv',
            header: [
                { id: 'Description', title: 'Description' },
                { id: 'Type', title: 'Type' },
                { id: 'Softwares', title: 'Softwares' },
                { id: 'Work instruction', title: 'Work instruction' },
                { id: 'Message', title: 'Message' },
                { id: 'Files', title: 'Files' },
                { id: 'Base Resume', title: 'Base Resume' },
                { id: 'Supplementary Resume', title: 'Supplementary Resume' },
                { id: 'Difficulty level', title: 'Difficulty level' },
                { id: 'Resolution', title: 'Resolution' },
                { id: 'Logs', title: 'Logs' }
            ]
        });

        await csvWriter.writeRecords(results);

        console.log('O arquivo CSV foi escrito com sucesso.');
    });

async function openAIClassification(data) {
    const prompt = 'Identifique o principal software utilizado na resolução do chamado abaixo. Classifique o Difficulty level do chamado em questão em uma escala de 1 a 3 (1=fácil, 2=médio, 3=difícil). Faça a identificação por meio das informações disponíveis nas colunas Resolution e Logs e retorne um objeto no seguinte modelo {"software": "softwareA", "difficulty": "2"}\n' + JSON.stringify(data);
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-4o",
    });
    
    const rawString = completion.choices[0].message.content
    const cleanedString = rawString.replace(/```json|```|\n/g, '').trim();
    const jsonObject = JSON.parse(cleanedString);
    data['Softwares'] = jsonObject.software
    data['Difficulty level'] = jsonObject.difficulty
}

