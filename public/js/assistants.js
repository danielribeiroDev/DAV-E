
document.addEventListener("DOMContentLoaded", function() {
    var modalAssistants = new bootstrap.Modal('#modal-assistants')
    var modalCollecions = new bootstrap.Modal('#modal-collections')

    generateAssistantsUI()
    // Get the element by ID
    document.getElementById("create-assistant").addEventListener("click", async (e) => {
        createAssistant(e, modalAssistants)
    })

    document.getElementById("attach-collection").addEventListener("click", async (e) => {
        attachCollection(e, modalCollecions)
    })

    document.getElementById("attach-collection-button").addEventListener("click", async e => {

        fillAttachCollectionModal()
    })
});

const generateAssistantsUI = async () => {
    let content = ``
    const template = 
    `
    <li class="d-flex mb-4 pb-1 assistant-item">
            <div class="avatar-no-pointer flex-shrink-0 me-3 align-content-center">
            <span class="tf-icons bx bx-ghost"></span>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
            <div class="me-2">
                <h6 class="mb-0">{assistantName}</h6>
            </div>
            <div class="user-progress d-flex align-items-center gap-1">
                <span class="text-muted" data-uuid="{data-assistant-id}">{assistant-id}</span>
                <div class="dropdown" style="position: inherit;">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu delete-item">
                    <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                </div>
                </div>
            </div>
            </div>
        </li>
    `

    let {assistants} = await getPackage('assistants')
    assistants.forEach(assistant => {
        let replacements = {
            "{assistantName}": assistant.name,
            "{assistant-id}": formatUUID(assistant.id),
            "{data-assistant-id}": assistant.id
        }

        let filledTemplate = fillTemplate(template, replacements)
        content += filledTemplate
    });

    appendHtml("assistant-list", content)

    document.querySelectorAll('.assistant-item').forEach(item => {
        debugger
        item.addEventListener('click', async function(e) {
            setActiveItem({
                e,
                classList: '.assistant-item',
                data: 'data-refered-assistant-uuid',
                datasetParam: 'referedAssistantUuid',
                table: 'collection'
            })

            const assistantuuid = e.target.querySelector('[data-uuid]').dataset.uuid
            const payload = await getPackage(`assistants/collections/${assistantuuid}`) 
            generateAssistantCollectionsUI(payload.collections)
        });
        item.querySelector('.delete-item').addEventListener('click', function(e) {
            e.stopPropagation();
        })
    });
}

const generateAssistantCollectionsUI = async (collections) => {
    let content = ``
    collections.attached.forEach(collection => {
        const template = 
        `<tr>
            <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{collection-name}</strong></td>
            <td>{collection-id}</td>
            <td>
                <div class="dropdown" style="position: inherit;">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                    <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                </div>
                </div>
            </td>
        </tr>`  

        const replacements = {
            '{collection-name}': collection.name,
            '{collection-id}': collection.id,
        };
        
        let filledTemplate = fillTemplate(template, replacements)

        content += filledTemplate
    });

    appendHtml("collection-table", content)
    
}

const createAssistant = async (e, modalAssistants) => {
    const template = 
       `
        <li class="d-flex mb-4 pb-1 assistant-item">
            <div class="avatar-no-pointer flex-shrink-0 me-3 align-content-center">
            <span class="tf-icons bx bx-collection"></span>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
            <div class="me-2">
                <h6 class="mb-0">{assistant-name}</h6>
            </div>
            <div class="user-progress d-flex align-items-center gap-1">
                <span class="text-muted" data-uuid="{data-assistant-id}">{assistant-id}</span>
                <div class="dropdown" style="position: inherit;">
                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                    <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu delete-item">
                    <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                </div>
                </div>
            </div>
            </div>
        </li>
        `

    const assistantName = document.getElementById("assistant-name")
    const assistantDescription = document.getElementById("assistant-description")

    const payload = await postPackage({
        route: "assistants",
        body: {
            assistant: {
                name: assistantName.value,
                description: assistantDescription.value
            }
        }
    })

    const replacements = {
        '{assistant-name}': payload.assistant.name,
        '{assistant-id}':  formatUUID(payload.assistant.id),
        '{data-assistant-id}': payload.assistant.id
    }

    const filledTemplate = fillTemplate(template, replacements)
    appendHtml("assistant-list", filledTemplate)
    const lastChild = document.getElementById('assistant-list').lastElementChild
    lastChild.addEventListener('click', async e => {
        setActiveItem({
            e,
            classList: '.assistant-item',
            data: 'data-refered-assistant-uuid',
            datasetParam: 'referedAssistantUuid',
            table: 'collection'
        })

        // item.querySelector('.delete-item').addEventListener('click', function(e) {
        //     e.stopPropagation();
        //     console.log(`Item ${item.querySelector('h6').textContent} deletado!`);
        // })
        const payload = await getPackage(`assistants/collections/${document.querySelector('[data-refered-assistant-uuid]').dataset.referedAssistantUuid}`) ///////////
        generateAssistantCollectionsUI(payload.collections)
    })

    setActiveItem({
        element: lastChild,
        classList: '.assistant-item',
        data: 'data-refered-assistant-uuid',
        datasetParam: 'referedAssistantUuid',
        table: 'collection'
    })

    assistantName.value = ''
    assistantDescription.value = ''
    modalAssistants.hide()
}

const fillAttachCollectionModal = async () => {
    
    let content = ``
    const template = 
    `
    <label class="list-group-item">
        <input class="form-check-input me-1" type="checkbox" value="{collection-id}"> {collection-name}
    </label>
    `

    const assistantId = document.querySelector('#assistant-list').querySelector('.active').querySelector('[data-uuid]').dataset.uuid
    const payload = await getPackage(`assistants/collections/available/${assistantId}`)

    payload.collections.available.forEach(collection => {
        let replacements= {
            "{collection-id}": collection.id,
            "{collection-name}": collection.name 
        }
        let filledTemplate = fillTemplate(template, replacements)
        content += filledTemplate
    });

    document.querySelector('#available-collections').innerHTML = ''
    appendHtml('available-collections', content)
}

const attachCollection = async (e, modalCollecions) => {
    
    const collections = document.querySelectorAll('#available-collections .form-check-input')
    let checkeds = []

    collections.forEach(collection => {
        if(collection.checked) 
            checkeds.push(collection.value)
    });

    const assistantId = document.querySelector('[data-refered-assistant-uuid]').dataset.referedAssistantUuid
    let payload = await postPackage({ 
        route: 'assistants/collections', 
        body: {
            assistantId,
            collections: checkeds
        }
    })

    payload = await getPackage(`assistants/collections/${assistantId}`)

    document.querySelector('#collection-table').innerHTML = ''
    generateAssistantCollectionsUI(payload.collections)
    modalCollecions.hide()
}

