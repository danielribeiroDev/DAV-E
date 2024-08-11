// Load the DOM
document.addEventListener("DOMContentLoaded", function() {
    var modalCollections = new bootstrap.Modal('#modal-collections')
    var modalFiles = new bootstrap.Modal('#modal-files')

    generateCollectionsUI()
    // Get the element by ID
    document.getElementById("create-collection").addEventListener("click", async (e) => {
        const template = 
       `
        <li class="d-flex mb-4 pb-1 collection-item">
            <div class="avatar-no-pointer flex-shrink-0 me-3 align-content-center">
            <span class="tf-icons bx bx-collection"></span>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
            <div class="me-2">
                <h6 class="mb-0">{collection-name}</h6>
            </div>
            <div class="user-progress d-flex align-items-center gap-1">
                <span class="text-muted" data-uuid="{data-collection-id}">{collection-id}</span>
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

        const collectionName = document.getElementById("collection-name")
        const collectionDescription = document.getElementById("collection-description")

        const payload = await postPackage({
            route: "collections",
            body: {
                collection: {
                    name: collectionName.value,
                    description: collectionDescription.value
                }
            }
        })

        const replacements = {
            '{collection-name}': payload.collection.name,
            '{collection-id}':  formatUUID(payload.collection.id),
            '{data-collection-id}': payload.collection.id
        }

        const filledTemplate = fillTemplate(template, replacements)
        appendHtml("collection-list", filledTemplate)
        document.getElementById('collection-list').lastElementChild.addEventListener('click', async e => {
            document.querySelector('#file-table').innerHTML = ''
            document.querySelectorAll('.collection-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
            let collectionuuid = e.target.querySelector('[data-uuid]').dataset.uuid
            document.querySelector('[data-refered-collection-uuid]').dataset.referedCollectionUuid = collectionuuid

            // item.querySelector('.delete-item').addEventListener('click', function(e) {
            //     e.stopPropagation();
            //     console.log(`Item ${item.querySelector('h6').textContent} deletado!`);
            // })
            const payload = await getPackage(`collections/files/${collectionuuid}`)
            generateCollectionFilesUI(payload.files)
        })

        collectionName.value = ''
        collectionDescription.value = ''
        modalCollections.hide()
    })

    document.getElementById("add-file").addEventListener("click", async (e) => {
        const template = 
        `
        <tr>
            <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{file-name}</strong></td>
            <td>{file-id}</td>
            <td>{file-date}</td>
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
        </tr>
        `
        const fileDescription = document.getElementById("file-description")
        const filePurpose = document.getElementById("file-purpose")
        const fileInput = document.getElementById("file")

        const payload = await postFile('collections/files/upload', fileInput.files[0], {
            collectionId: document.querySelector('[data-refered-collection-uuid]').dataset.referedCollectionUuid,
            description: fileDescription.value,
            purpose: filePurpose.value
        })

        const replacements = {
            '{file-name}': payload.file.name,
            '{file-id}': payload.file.id,
            '{file-date}': payload.file.date,
        };
        
        let filledTemplate = template
        for (const key in replacements) {
            filledTemplate = filledTemplate.replace(key, replacements[key]);
        }

        appendHtml("file-table", filledTemplate)

        fileDescription.value = ''
        filePurpose.value = ''
        fileInput.value = ''

        modalFiles.hide()
    })
});

const filesInfoMock = [
    {
        fileId: "dsgadfg...fds",
        fileName: "Constituição",
        fileDate: "20/03/2010"
    },
    {
        fileId: "fadfadf...hgj",
        fileName: "Relatório",
        fileDate: "15/07/2022"
    },
    {
        fileId: "hgjkth...kiu",
        fileName: "Documentação",
        fileDate: "01/12/2015"
    },
    {
        fileId: "fsdfdsf...fds",
        fileName: "Chamados",
        fileDate: "05/0/2017"
    }
]

const collectionsInfoMock = [
    {
        name: "Finance",
        id: "asdsadas...fsdf"
    },
    {
        name: "Support",
        id: "asdsadas...fsdf"
    },
    {
        name: "History",
        id: "asdsadas...fsdf"
    }
]

///:: Generate file-table
const generateCollectionFilesUI = (filesInfo) => {
    let content = ``
    filesInfo.forEach(file => {
        const template = 
        `<tr>
            <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{file-name}</strong></td>
            <td>{file-id}</td>
            <td>{file-date}</td>
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
            '{file-name}': file.name,
            '{file-id}': file.id,
            '{file-date}': file.date,
        };
        
        let filledTemplate = template
        for (const key in replacements) {
            filledTemplate = filledTemplate.replace(key, replacements[key]);
        }

        content += filledTemplate
    });

    appendHtml("file-table", content)
}

const generateCollectionsUI = async () => {
    let content = ``
    const template = 
        `
        <li class="d-flex mb-4 pb-1 collection-item">
            <div class="avatar-no-pointer flex-shrink-0 me-3 align-content-center">
            <span class="tf-icons bx bx-collection"></span>
            </div>
            <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
            <div class="me-2">
                <h6 class="mb-0">{collectionName}</h6>
            </div>
            <div class="user-progress d-flex align-items-center gap-1">
                <span class="text-muted" data-uuid="{data-collection-id}">{collection-id}</span>
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
    
    let {collections} = await getPackage('collections')

    collections.forEach(collection => {
        let replacements = {
            "{collectionName}": collection.name,
            "{collection-id}": formatUUID(collection.id),
            "{data-collection-id}": collection.id
        }
        let filledTemplate = fillTemplate(template, replacements)
        content += filledTemplate
    });

    appendHtml("collection-list", content)
    
    document.querySelectorAll('.collection-item').forEach(item => {
        item.addEventListener('click', async function(e) {
            document.querySelector('#file-table').innerHTML = ''
            document.querySelectorAll('.collection-item').forEach(i => i.classList.remove('active'));
            e.currentTarget.classList.add('active');
            let collectionuuid = e.target.querySelector('[data-uuid]').dataset.uuid
            document.querySelector('[data-refered-collection-uuid]').dataset.referedCollectionUuid = collectionuuid

            const payload = await getPackage(`collections/files/${collectionuuid}`)
            generateCollectionFilesUI(payload.files)
        });
        item.querySelector('.delete-item').addEventListener('click', function(e) {
            e.stopPropagation();
        })
    });

    
}

function fillTemplate(template, replacements, ) {
    let filledTemplate = template;
    for (const key in replacements) {
        filledTemplate = filledTemplate.replace(key, replacements[key]);
    }
    return filledTemplate;
}

function appendHtml(id, template) {
    document.getElementById(id).insertAdjacentHTML('beforeend', template);
}

async function postPackage({ route, body }) {
    
    const response = await fetch(`http://localhost:3000/${route}`, {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
    })

    const payload = await response.json()

    return payload
}

async function getPackage(route) {
    const response = await fetch(`http://localhost:3000/${route}`, {
        method: "GET",
    })

    const payload = await response.json()

    return payload
}

async function postFile(route, file, options) {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(options)) {
        formData.append(key, value);
    }

    const response = await fetch(`http://localhost:3000/${route}`, {
        method: 'POST',
        body: formData
     });
    const payload = await response.json();

    return payload
}

function formatUUID(uuid) {
    const startLength = 5; 
    const endLength = 3;  

    if (uuid.length <= startLength + endLength) {
       
        return uuid;
    }

    const start = uuid.substring(0, startLength);
    const end = uuid.substring(uuid.length - endLength);
    return `${start}...${end}`;
}