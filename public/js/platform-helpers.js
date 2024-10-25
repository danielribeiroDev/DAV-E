const host = 'http://177.71.145.74/'

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
    showLoading()
    const response = await fetch(`${host}${route}`, {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            'Authorization': `${getAuthToken()}`,
            'Content-Type': 'application/json', // Define o tipo de conteúdo como JSON
        },
    })

    const payload = await response.json()
    hideLoading()
    return payload
}

async function getImage({ route, body }) {
    const response = await fetch(`${host}${route}`, {
        body: JSON.stringify(body),
        method: "POST",
        headers: {
            'Authorization': `${getAuthToken()}`,
            'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
        },
    })

    const blob = await response.blob()
    const imgUrl = URL.createObjectURL(blob)
    return { imgUrl }
}

async function getPackage(route) {
    showLoading()
    const response = await fetch(`${host}${route}`, {
        method: "GET",
        headers: {
            'Authorization': `${getAuthToken()}`
        }
    })

    const payload = await response.json()
    hideLoading()
    return payload
}

async function postFile(route, file, options) {
    showLoading()
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(options)) {
        formData.append(key, value);
    }

    const response = await fetch(`${host}${route}`, {
        method: 'POST',
        headers: {
            'Authorization': `${getAuthToken()}`
        },
        body: formData
     });
    const payload = await response.json();
    hideLoading()
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

function showLoading() {
    document.getElementById('loading-overlay')?.classList.add('show');
}
  
function hideLoading() {
    document.getElementById('loading-overlay')?.classList.remove('show');
}
  
function setActiveItem({ e, classList, data, datasetParam, element, table }) {
    document.querySelector(`#${table}-table`).innerHTML = ''
    document.querySelectorAll(classList).forEach(i => {
        i.classList.remove('active')
    });
    let collectionuuid
    if(element) {
        element.classList.add('active');
        collectionuuid = element.querySelector('[data-uuid]').dataset.uuid
    } else {
        e.currentTarget.classList.add('active');
        collectionuuid = e.target.querySelector('[data-uuid]').dataset.uuid
    }
    document.querySelector(`[${data}]`).dataset[`${datasetParam}`] = collectionuuid
}

function getAuthToken() {
    return localStorage.getItem('authToken')
}