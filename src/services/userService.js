import db from '../models/index';
import bcrypt from 'bcryptjs';



let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: { email: email },
                    raw: true,

                });
                if (user) {
                    let check = await bcrypt.compare(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password;
                        userData.user = user;
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User not found`;
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in our system, plz try other email`
            }
            resolve(userData)
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll();
            resolve({
                errCode: 0,
                message: "Success",
                data: users
            });
        } catch (e) {
            reject(e);
        }
    });
};

let getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid user ID"
                });
            }

            let user = await db.User.findOne({ where: { id: id } });
            if (user) {
                resolve({
                    errCode: 0,
                    message: "Success",
                    data: user
                });
            } else {
                resolve({
                    errCode: 2,
                    message: "User not found"
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.username || !data.email || !data.password) {
                resolve({
                    errCode: 1,
                    message: "Missing required fields!"
                });
            }

            let newUser = await db.User.create({
                username: data.username,
                email: data.email,
                password: data.password, // Lưu ý: cần mã hóa mật khẩu trước khi lưu
                role: data.role || 'user'
            });

            resolve({
                errCode: 0,
                message: "User created successfully",
                data: newUser
            });
        } catch (e) {
            reject(e);
        }
    });
};

let updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid user ID"
                });
            }

            let user = await db.User.findOne({ where: { id: id } });

            if (!user) {
                resolve({
                    errCode: 2,
                    message: "User not found"
                });
            }

            await user.update({
                username: data.username || user.username,
                email: data.email || user.email,
                role: data.role || user.role
            });

            resolve({
                errCode: 0,
                message: "User updated successfully",
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!ObjectId.isValid(id)) {
                resolve({
                    errCode: 1,
                    message: "Invalid user ID"
                });
            }

            let user = await db.User.findOne({ where: { id: id } });

            if (!user) {
                resolve({
                    errCode: 2,
                    message: "User not found"
                });
            }

            await db.User.destroy({ where: { id: id } });

            resolve({
                errCode: 0,
                message: "User deleted successfully"
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}