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

let handleUserGoogle = async (req, res) => {
    let message = await userService.handleUserGoogle(req.body);
    return res.status(200).json(message);
};

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
    try {
        let infor = await userService.getUserById(req.query.id);
        return res.status(200).json(infor);
      } catch (e) {
        console.log(e);
        return res.status(200).json({
          errCode: -1,
          errMessage: "Error from server...",
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
    let data = req.body;
    let message = await userService.updateUser(data);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      let message = await userService.deleteUser(req.body.id);
      return res.status(200).json(message);
};

let refreshAccessToken = (req, res) => {
    const refreshToken = req.header("Refresh-Token");
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }
      const newAccessToken = generateAccessToken({
        id: user.id,
        username: user.username,
      });
      res.json({ token: newAccessToken });
    });
  };

module.exports = {
    handleLoging,
    handleGetAllUsers,
    handleGetUserById,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleUserGoogle,
    refreshAccessToken
}