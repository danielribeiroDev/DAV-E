///:: http server handle
import express from 'express';

import path, { dirname } from 'path'

///:: relational database init function
import { initializeDatabase } from './src/database.js';

import Memcached from './src/services/platform/memcached.js';

///:: vector database provider and embeddings provider 
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings } from '@langchain/openai';

///:: collection 
import { gvCollectionServiceInstance } from './src/factories/vCollectionFactory.js';
import { grCollectionServiceInstance } from './src/factories/rCollectionFactory.js';
import collectionRoutes from './src/routes/collectionRoutes.js';

///:: assistant
import { gAssistantServiceInstance } from './src/factories/assistantFactory.js';
import assistantRoutes from './src/routes/assistantRoutes.js';

///:: chat
import { gChatServiceInstance } from './src/factories/chatFactory.js';
import chatRoutes from './src/routes/chatRoutes.js';

///:: files loader
import Loader from './src/services/AI/Loader.js';

///:: set up .env vars
import * as dotenv from "dotenv";
dotenv.config();

import cors from 'cors';
import { fileURLToPath } from 'url';

///:: setup server
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

///:: set up iddlewares  
app.use(express.json());

///:: set up static files
app.use(express.static('public'))

async function startServer() {
  try {
    const db = await initializeDatabase()

    const memcached = new Memcached()

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

    ///:: set up default route
    app.get('/', (req, res) => {
      res.sendFile(path.join(dirname(fileURLToPath(import.meta.url)), 'public', 'html', 'index.html'));
    });

    ///:: set up collection routes
    app.use('/collections', collectionRoutes(vcollectionService, rcollectionService, loader))

    ///:: set up assistant routes
    app.use('/assistants', assistantRoutes(rcollectionService, assistantService))

    ///:: set up chat routes
    app.use('/chat', chatRoutes(chatService))

    ///:: init express server 
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
  }
}

startServer();
