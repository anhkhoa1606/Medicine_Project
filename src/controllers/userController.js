import userService from '../services/userService';

let handleLoging = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        })
    }

    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    try {
        let users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleGetUserById = async (req, res) => {
    let userId = req.params.id;
    try {
        let user = await userService.getUserById(userId);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleCreateUser = async (req, res) => {
    try {
        let newUser = await userService.createUser(req.body);
        return res.status(200).json(newUser);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleUpdateUser = async (req, res) => {
    let userId = req.params.id;
    try {
        let updatedUser = await userService.updateUser(userId, req.body);
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

let handleDeleteUser = async (req, res) => {
    let userId = req.params.id;
    try {
        let response = await userService.deleteUser(userId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server',
        });
    }
};

module.exports = {
    handleLoging,
    handleGetAllUsers,
    handleGetUserById,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser
}