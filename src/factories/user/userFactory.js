import UserService from "../../services/user/userService.js";
import UserRepository from "../../repositories/user/userRepository.js";

const gUserServiceInstance = ({
    db,
    authService
}) => {
    const userRepository = new UserRepository({ db })
    const userService = new UserService({
        userRepository,
        authService
    })
    return userService
}

export {
    gUserServiceInstance
}