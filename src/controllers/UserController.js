const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { fullname, username, phone, email, password } = req.body;
    const reg =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const isCheckEmail = reg.test(email);
    if (!fullname || !username || !phone || !email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required ",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is not email",
      });
      // } else if (password !== repassword) {
      //   return res.status(200).json({
      //     status: "ERR",
      //     message: "The password is equa repassword",
      //   });
    }
    const response = await UserService.createUser(req.body);
    console.log("response", response);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // const reg =
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!username || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await UserService.loginUser(req.body);

    return res.status(200).json(response);
    // return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await UserService.loginAdmin(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    // const reg =
    //   /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // const isCheckEmail = reg.test(email);
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is not require",
      });

      // } else if (!isCheckEmail) {
      //   return res.status(200).json({
      //     status: "ERR",
      //     message: "The input is not email",
      //   });
    }
    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // const token = req.headers
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is not require",
      });
    }
    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // const token = req.headers
    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is not require",
      });
    }
    const response = await UserService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }
};

const getSearchUser = async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const response = await UserService.getSearchUser(searchTerm);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(400).json({
      message: "Error occurred while searching for users",
    });
  }
};

//PAGINATION
const paginateResults = (data, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedData = {};

  if (endIndex < data.length) {
    paginatedData.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    paginatedData.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  paginatedData.results = data.slice(startIndex, endIndex);

  return paginatedData;
};

const pagination = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const data = await UserService.fetchUserData(); // Lấy dữ liệu từ UserService
    const paginatedData = paginateResults(
      data,
      parseInt(page),
      parseInt(limit)
    );
    res.json(paginatedData); // Trả về dữ liệu phân trang
  } catch (error) {
    console.error("Lỗi khi xử lý phân trang:", error);
    res.status(500).json({ error: "Lỗi khi xử lý phân trang" });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  loginAdmin,
  getSearchUser,
  pagination,
};
