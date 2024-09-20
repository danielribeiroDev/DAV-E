import path, { dirname } from 'path'

///:: http server handle
import express from 'express';

///:: relational database setup
import { initializeDatabase, setup_project_tables } from './src/helpers/database.js';

import Memcached from './src/services/memcached.js';

///:: vector database provider and embeddings provider 
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';

///:: collection 
import { gvCollectionServiceInstance } from './src/factories/collection/vCollectionFactory.js';
import { grCollectionServiceInstance } from './src/factories/collection/rCollectionFactory.js';
import collectionRoutes from './src/routes/collection/collectionRoutes.js';

///:: assistant
import { gAssistantServiceInstance } from './src/factories/assistant/assistantFactory.js';
import assistantRoutes from './src/routes/assistant/assistantRoutes.js';

///:: chat
import { gChatServiceInstance } from './src/factories/chat/chatFactory.js';
import chatRoutes from './src/routes/chat/chatRoutes.js';

///:: file
import fileRoutes from './src/routes/fileRoutes.js';

///:: files loader
import Loader from './src/services/loader.js';

///:: .env vars
import * as dotenv from "dotenv";
dotenv.config();

///:: cors police
import cors from 'cors';
import { fileURLToPath } from 'url';

///:: setup server
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

///:: setup middlewares  
app.use(express.json());

///:: setup static files
app.use(express.static('public'))

async function startServer() {
  try {
    const db = await initializeDatabase()
    await setup_project_tables(db)

    const memcached = new Memcached()

    ///:: generate service instances
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
    const assistantService = gAssistantServiceInstance({ db })
    const chatService = gChatServiceInstance({ 
      db,
      assistantService,
      vcollectionService,
      memcached
    })

    const dirReference = dirname(fileURLToPath(import.meta.url))

    ///:: setup default route
    app.get('/', (req, res) => {
      res.sendFile(path.join(dirReference, 'public', 'html', 'index.html'));
    });

    ///:: setup collection routes
    app.use('/collections', collectionRoutes(vcollectionService, rcollectionService, loader))

    ///:: setup assistant routes
    app.use('/assistants', assistantRoutes(rcollectionService, assistantService))

    ///:: setup chat routes
    app.use('/chat', chatRoutes(chatService))

    app.use('/file', fileRoutes())

    ///:: init express server 
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
      console.log(`http://localhost:${PORT}`)
    });
  } catch (error) {
    console.error('Failed to start the server', error);
  }
}

startServer();
