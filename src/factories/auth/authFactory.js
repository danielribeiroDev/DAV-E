import  AuthService  from '../../services/auth/authService.js';

const gAuthServiceInstance = () => {
    const authService = new AuthService()

    return authService
}

export {
    gAuthServiceInstance
}