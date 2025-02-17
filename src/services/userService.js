import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exist
                let user = await db.User.findOne({
                    attributes: ['id','email', 'roleId', 'password'],
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

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
      try {
        let hashPassWord = bcrypt.hashSync(password, salt);
        resolve(hashPassWord);
      } catch (e) {
        reject(e);
      }
    });
};

let createUser = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let check = await checkUserEmail(data.email);
        if (check === true) {
          resolve({
            errCode: 1,
            errMessage:
              "Your email already exists, Plz try another email address",
          });
        } else {
          let hashPassWordFromBcrypt = await hashUserPassword(data.password);
  
          await db.User.create({
            email: data.email,
            password: hashPassWordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            role: data.role || 'customer'
          });
          resolve({
            errCode: 0,
            message: "Ok",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

let updateUser = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.id) {
          resolve({
            errCode: 2,
            errMessage: "Missing required parameters!",
          });
        }
        console.log(data)
        let user = await db.User.findOne({
          where: { id: data.id },
        });
        if (user) {
          (user.id = data.id),
            (user.email = data.email),
          (user.firstName = data.firstName),
            (user.lastName = data.lastName),
            (user.address = data.address),
            (user.phoneNumber = data.phoneNumber),
            (user.roleId = data.roleId),
            (user.gender = data.gender);
            (user.image = data.image);
          await user.save();
          resolve({
            errCode: 0,
            message: "The user has been updated successfully",
          });
        } else {
          resolve({
            errCode: 1,
            message: "USer not found",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({ where: { id: userId } });

            if (!user) {
                resolve({
                    errCode: 2,
                    message: "User not found"
                });
            }

            await db.User.destroy({ where: { id: userId } });

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