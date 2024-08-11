import { CSVLoader } from "@langchain/community/document_loaders/fs/csv"

export default class Loader {
    constructor() {

    }

    async csv({ path }) {
        const loader = new CSVLoader(path)
        return await loader.load()
    }

    async pdf({ path }) {
        
    }

    async txt({ path }) {

    }
}