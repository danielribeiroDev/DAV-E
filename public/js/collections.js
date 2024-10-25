
document.addEventListener("DOMContentLoaded", function() {
    var modalCollections = new bootstrap.Modal('#modal-collections')
    var modalFiles = new bootstrap.Modal('#modal-files')

    generateCollectionsUI()
    // Get the element by ID
    document.getElementById("create-collection").addEventListener("click", async (e) => {
        createCollection(e, modalCollections)
    })

    document.getElementById("add-file").addEventListener("click", async (e) => {
        addFile(e, modalFiles)
    })
});

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

const createCollection = async (e, modalCollections) => {
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
    const lastChild = document.getElementById('collection-list').lastElementChild
    lastChild.addEventListener('click', async e => {
        setActiveItem({ 
            e,
            classList: '.collection-item', 
            data: 'data-refered-collection-uuid', 
            datasetParam: 'referedCollectionUuid',
            table: 'file'
        } )
        // item.querySelector('.delete-item').addEventListener('click', function(e) {
        //     e.stopPropagation();
        //     console.log(`Item ${item.querySelector('h6').textContent} deletado!`);
        // })
        const payload = await getPackage(`collections/files/${document.querySelector('[data-refered-collection-uuid]').dataset.referedCollectionUuid}`)
        generateCollectionFilesUI(payload.files)
    })

    setActiveItem({ 
        classList: '.collection-item', 
        data: 'data-refered-collection-uuid', 
        datasetParam: 'referedCollectionUuid', 
        element: lastChild,
        table: 'file' 
    })

    collectionName.value = ''
    collectionDescription.value = ''
    modalCollections.hide()
}

const addFile = async (e, modalFiles) => {
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
    const fileInput = document.getElementById("file")

    const payload = await postFile('collections/files/upload', fileInput.files[0], {
        collectionId: document.querySelector('[data-refered-collection-uuid]').dataset.referedCollectionUuid,
        description: fileDescription.value,
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
    fileInput.value = ''
    modalFiles.hide()
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

