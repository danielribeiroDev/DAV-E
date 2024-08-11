///:: http server handle
import express from 'express';

///:: relational database init function
import { initializeDatabase } from './src/database.js';

///:: vector database provider and embeddings provider 
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';

///:: collection 
import { gvCollectionServiceInstance } from './src/factories/vCollectionFactory.js';
import { grCollectionServiceInstance } from './src/factories/rCollectionFactory.js';
import collectionRoutes from './src/routes/collectionRoutes.js';

///:: files loader
import Loader from './src/services/AI/Loader.js';

///:: set up .env vars
import * as dotenv from "dotenv";
dotenv.config();

///:: setup server
const app = express();
const PORT = process.env.PORT || 3000;

///:: set up iddlewares  
app.use(express.json());

///:: set up static files
app.use(express.static('public'))

async function startServer() {
  try {
    const db = await initializeDatabase()

    const vcollectionService = gvCollectionServiceInstance(
      {
        provider: Chroma,
        url: "http://localhost:8000",
        embeddingHanldeObject: new OpenAIEmbeddings(),
        hnsw_space: "cosine"
      }
    )
    const rcollectionService = grCollectionServiceInstance({ db })

    const loader = new Loader()

    ///:: set up default route
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
    });

    ///:: set up collection routes
    app.use('/collections', collectionRoutes(vcollectionService, rcollectionService, loader))

    ///:: init express server 
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
  }
}

startServer();
