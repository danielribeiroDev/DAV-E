
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

const signinBaseRoute = '/users/token'
const signupBaseRoute = '/users/'

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

document.addEventListener("DOMContentLoaded", async function() {
  await signinHandle()
  await signupHandle()
});

async function signinHandle() {
  const btnSubmit = document.querySelector('#sign_submit')

  btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    const inpEmail = document.querySelector('#signin-email')
    const inpPassword = document.querySelector('#signin-password')

    const invalids = validateInputs(inpEmail, inpPassword)

    if(invalids.length > 0) 
      return

    await signin({ email: inpEmail.value, password: inpPassword.value })

  })
}

async function signupHandle() {
  const btnSubmit = document.querySelector('#signup_submit')

  btnSubmit.addEventListener('click', async (e) => {
    e.preventDefault()
    const inpEmail = document.querySelector('#signup-email')
    const inpPassword = document.querySelector('#signup-password')
    const inpName = document.querySelector('#signup-name')

    const invalids = validateInputs(inpEmail, inpPassword, inpName)

    if(invalids.length > 0) 
      return

    await signup({ email: inpEmail.value, password: inpPassword.value, name: inpName.value })

  })
}

function validateInputs(...args) {
  const invalidinputs = []
  args.forEach(input => {
    switch(input.type) {
      case 'email':
        break;
      case 'password':
        break;
      case 'text':
        break;
      case 'phone':
        break;
      default:
        break;
    }
  });
  return invalidinputs
}

async function signin({ email, password }) {
  const payload = await postPackage({
    route: 'users/token',
    body: {
      user: {
        email,
        password
      }
    }
  })

  if(!payload.user.token)
    return
  localStorage.setItem('authToken', payload.user.token)
  window.location.href = '/html/collections.html'
}

async function signup({ email, password, name }) {
  const payload = await postPackage({
    route: 'users/',
    body: {
      user: {
        email,
        password,
        name
      }
    }
  })

  if(!payload.user)
    return

  window.location.href = '/html/signin.html'
}