# Virtual Assistant Creation Simplified

This project aims to streamline the process of creating custom virtual assistants based on your own documents.
You can simply create an specialist in a determined area to help you in any situation.

## Key Features:

- **Document Upload & Collection**: Easily upload your relevant files and organize them into collections. Once done, you can launch a virtual assistant equipped with the knowledge from the documents you provided.

- **Multimodal Responses**: The assistant isn't limited to text; it can also respond with images you’ve uploaded, making interactions more engaging and effective.

- **Learning & Adaptation** *(In Development)*: The assistant learns continuously from its interactions, improving by recognizing mistakes and gaining insights over time.

- **Insight Maker** *(In Development)*: The application analyse your chat history and provide helpful insights to you.

## Built with:

- **[LangChain.js](https://js.langchain.com/v0.2/docs/introduction/)**: The project utilizes the LangChain.js library to simplify interactions with Large Language Models (LLMs), making it easier to build intelligent assistants.

- **[Chroma](https://www.trychroma.com/)**: To enhance the assistant's intelligence, a vector store is used to store document data and apply a Retrieval-Augmented Generation (RAG) approach, improving response quality by leveraging your custom documents.

- **[Open AI](https://openai.com/)**: A powerfull source of generative LLMs to make assistants possible.

- **[Express](https://expressjs.com/)**: For routing.

- **[Postgres](https://www.postgresql.org/)**: To relational database.

- **[Docker](https://www.docker.com/)**: For containerization and simply setup of dependencies.

## For the Future . . .
- API RESTFUL for integrations with another systems. 
- Multi-assistants feature, that allow chat with more than one assistant at the same time.
- Make assistants more smart with better RAG approachs.
- Implement any king of media retriever like video and audio to render in our chats.
- . . .  sorry, i'm so tired to complete that list now.

## For now . . .
- Finish the Learning & Adaptation and Insight Maker features.
- Persist the user chat-history in database - current it is persisted in memory.
- Interface to user put your OPEN AI key in platform dynamically - current it is handle in .env file.

## How It Works

### 1. Creating a collection
To begin, you can create a collection.

![Create a collection](./readme-images/create-a-collection.png)

### 2. Uploading a file
So, upload the relevant files that the assistant will use as its knowledge base.

![Upload a file](./readme-images/add-file.png)

### 3. Creating an assistant
Create an assistant based on your collections.

![Create an assistant](./readme-images/create-an-assistant.png)

### 4. Attach a collection in the assistant

![Attach a collection](./readme-images/attach-a-collection-to-assistant.png)

### 5. Lauching a chat
Launch a chat with one of your assistants, then select the chat in sidebar.

![Launch a chat](./readme-images/launch-chat.png)

### 6. Send a message
Send a message, and see the magic happen!

![Send a message](./readme-images/send-message.png)

## Setup project 
- You must have installed Node Js >= 20.
- You must have docker installed also.

### 1. Containers
Run the following code in terminal to execute docker compose file:
```
docker-compose up -d
```

### 2. Dependencies
Download Node Js depencies:
```
npm init
```

### 3. Environmente variables
Create and populate .env file with the schema provided in .example.env

### 4. Run
Execute the following code in your terminal to run the project:
```
npm start
```


