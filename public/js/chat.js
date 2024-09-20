
var modalAssistant
document.addEventListener("DOMContentLoaded", async function() {
    modalAssistant = new bootstrap.Modal('#modal-assistants')
    ///:: New chat event
    document.querySelector('#new-chat').addEventListener('click', e => {
        fillAssistantsModal(modalAssistant)
    })

    initChatList()

 })

 async function fillAssistantsModal() {
    document.querySelector('#assistant-list').innerHTML = ''
    const template = 
    `
     <li class="col mb-3">
        <button type="button" class="btn btn-primary" data-uuid="{uuid}">
        <span class="tf-icons bx bx-ghost"></span>&nbsp; {assistant-name}
        </button>
    </li>
    `

    let content = ``
    const payload = await getPackage('assistants')
    payload.assistants.forEach(assistant => {
        let replacements = {
            "{assistant-name}": assistant.name,
            "{uuid}": assistant.id
        }

        let filledTemplate = fillTemplate(template, replacements)
        content += filledTemplate
    });

    appendHtml('assistant-list', content)

    ///:: Capture event when user choose an assistant, send to server and reload the assistant-list
    document.querySelectorAll('#assistant-list button').forEach( button =>  {
        createChatHandle(button, )
    })

 }

 function createChatHandle(button, modal) {
    button.addEventListener('click', async e => {
        const payload = await postPackage({ 
            route: 'chat',
            body: {
                assistantId: e.target.dataset.uuid,
            }
        })

        const template = 
        `
        <li class="menu-item">
            <div href="#" class="menu-link" data-uuid="{uuid}">
            <div>{chat-name}</div>
            </div>
        </li>
        `

        const replacements = {
            "{chat-name}": payload.name,
            "{uuid}": payload.id
        }

        const filledTemplate = fillTemplate(template, replacements)

        appendHtml('chat-list', filledTemplate)

        modalAssistant.hide()
    })
 }

 function setupChatList() {
    document.querySelectorAll('#chat-list li .menu-link').forEach(a => {
        a.addEventListener('click', e => {
            setActiveChat(e)
        })
    })
 }

async function setActiveChat(e) {
    ///:: Disable previous active chat and activate the one that was selected
    document.querySelector('#chat-list .active')?.classList.remove('active')
    const currentMenuItem = e.target.closest('.menu-item');
    currentMenuItem.classList.add('active')

    ///:: Get assistant related to chat and adds its name to the chat-box 
    const payload = await getPackage(`chat/${e.target.dataset.uuid}`)
    document.querySelector('#chat-box-title').innerHTML = payload.chat.name

    ///:: Carregar conversa caso houver
 }

 async function initChatList() {
    const payload = await getPackage('chat')

    let content = ``
    let template = 
    `
    <li class="menu-item">
        <div href="" class="menu-link" data-uuid="{uuid}">
        <div>{chat-name}</div>
        </div>
    </li>
    `
    payload.chats.forEach(chat => {
        let replacements = {
            "{chat-name}": chat.name,
            "{uuid}": chat.id
        }

        let filledTemplate = fillTemplate(template, replacements)
        content += filledTemplate
    });

    appendHtml('chat-list', content)

    setupChatList()
 }

 document.addEventListener("DOMContentLoaded", function() {
    const inputField = document.querySelector('#chat-input');
    const sendButton = document.querySelector('#send-message');
    const messageContainer = document.getElementById('message-container');

    // Enviar a mensagem
    function sendMessage() {
        const userMessage = inputField.value;
        if (userMessage.trim() !== "") {
            // Exibe a mensagem do usuário na direita
            appendMessage({ message: userMessage, messageType: 'user-message' });
            
            // Enviar a mensagem para o chatbot e exibir a resposta
            getChatbotResponse(userMessage);
            
            inputField.value = ""; // Limpar o campo de entrada
        }
    }

    // Clique no botão de envio
    sendButton.addEventListener('click', sendMessage);

    // Pressionar Enter para enviar
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Sem quebra de linha
            sendMessage(); // Enviar a mensagem
        }
    });

    // adicionar mensagens no chat
    function appendMessage({ message, messageType }) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', messageType);
        messageElement.innerHTML = message;
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll 
    }

    // Depois integra com a API
    async function getChatbotResponse(userMessage) {
        // placeholder
        /*
        setTimeout(function() {
            const botResponse = "Lorem ipsum"; // Placeholder
            appendMessage(botResponse, 'bot-message');
        }, 1000);
        */
        const payload = await postPackage({ route: 'chat/message', body: {
            chat: {
                id: document.querySelector('#chat-list .active .menu-link').dataset.uuid,
                question: userMessage
            }
        } })

        const formated = await formatMessage({
            message: payload.answer,
            relativeImages: payload.relativeImages
        })

        appendMessage({
            message: formated,
            messageType: 'bot-message'
        })
    }

    async function formatMessage({ message, relativeImages }) {
        const replaced = message.replaceAll('\n', '<br>')
        
        let formated = replaced
        for(let obj of relativeImages) {
            const response = await getImage({ 
                route: 'file', 
                body: {
                    path: obj.source
                }
            })
            const element = `<img src=${response.imgUrl} style="max-height: 400px; margin: 25px 0px; display: block;">`

            const sliced = formated.slice(0, formated.indexOf('<br>', obj.line) + 4) + element + formated.slice(formated.indexOf('<br>', obj.line) + 4);

            formated = sliced
        }
        return formated
    }
});
