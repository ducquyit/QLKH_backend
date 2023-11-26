const User = require("../models/User");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { fullname, username, phone, email, password } = newUser;

    try {
      //Kiểm tra tên đăng nhập có tồn tại hay chưa
      const checkUser = await User.findOne({
        username: username,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The username is already",
        });
      }

      //Mã hoá Password
      const hash = bcrypt.hashSync(password, 10);
      const createUser = await User.create({
        fullname,
        username,
        phone,
        email,
        password: hash,
      });
      if (createUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = userLogin;

    try {
      //Kiểm tra tên đăng nhập có tồn tại hay chưa
      const checkUser = await User.findOne({
        username: username,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The username is not defined",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }
      const userId = checkUser.id;
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.admin,
      });

      // const refresh_token = await genneralRefreshToken({
      //   id: checkUser.id,
      //   isAdmin: checkUser.admin,
      // });

      resolve({
        status: "OK",
        message: "SUCCESS",
        id: userId,
        access_token,
        // refresh_token,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const loginAdmin = (adminLogin) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = adminLogin;

    try {
      //Kiểm tra tên đăng nhập có tồn tại hay chưa
      const checkUser = await User.findOne({
        username: username,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The username is not defined",
        });
      }

      if (checkUser.admin === false) {
        resolve({
          status: "ERR",
          message: "you are not admin",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user is incorrect",
        });
      }
      const userId = checkUser.id;
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.admin,
      });

      // const refresh_token = await genneralRefreshToken({
      //   id: checkUser.id,
      //   isAdmin: checkUser.isAdmin,
      // });

      resolve({
        status: "OK",
        message: "SUCCESS",
        // id: userId,
        access_token,
        // refresh_token,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      // const checkUsername = await User.findOne({
      //   username: username,
      // });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The username is not defined",
        });
      }
      // } else if (checkUsername !== null) {
      //   resolve({
      //     status: "ERR",
      //     message: "The username is already",
      //   });
      // }

      const updateUser = await User.findByIdAndUpdate(id, data, { new: true });
      console.log("updateUser", updateUser);

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updateUser,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The username is not defined",
        });
      }

      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete user success",
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      console.log("allUser", allUser);
      resolve({
        status: "OK",
        message: "Get All user success",
        data: allUser,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "OK",
          message: "The username is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Get All Detail user success",
        data: user,
      });
      // }
    } catch (e) {
      reject(e);
    }
  });
};

const getSearchUser = async (searchTerm) => {
  try {
    const findUser = await User.find({
      $or: [
        { fullname: { $regex: searchTerm, $options: "i" } },
        { username: { $regex: searchTerm, $options: "i" } },
        { phone: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    });

    return {
      status: "OK",
      message: "Find user success",
      data: findUser,
    };
  } catch (error) {
    throw error;
  }
};

// paginationService.js

const fetchUserData = async () => {
  try {
    // Thực hiện truy vấn dữ liệu từ cơ sở dữ liệu
    const userData = await User.find(); // Thay thế User.find() bằng truy vấn thích hợp của bạn
    return userData; // Trả về dữ liệu người dùng từ truy vấn
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    throw error;
  }
};

// const fetchUser = {
//   fetchUserData,
// };

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  loginAdmin,
  getSearchUser,
  fetchUserData,
};
