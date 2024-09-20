import { CSVLoader } from "@langchain/community/document_loaders/fs/csv"
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

///:: prepare documents in a langchain.documents structure
export default class Loader {
    constructor() {

    }

    async csv({ path }) {
        const loader = new CSVLoader(path)
        return await loader.load()
    }

    async pdf({ path }) {
        const loader = new PDFLoader(path);
        return  await loader.load()
    }

    async txt({ path }) {
        const loader = new TextLoader(path)
        return await loader.load()
    }

    image({ path, description }) {
        const doc = new Document({
            pageContent: description,
            metadata: {
                source: path,
                type: "image"
            }
        })
        return [doc]
    }
}