const router = require("express").Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator");

const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");



// register
router.post("/register", validInfo, async (req, res) => {
    try {
        // 1. destructure req.body
        // const {name, email, password} = req.body; (old)
        const { ten_nv, chucdanh, vitri, sdt, hrm, matkhau, phanquyen } = req.body;

        // 2. check if user exist
        const user = await pool.query("SELECT * FROM nhanvien WHERE HRM = $1", [hrm]);
        if (user.rows.length !== 0) {
            return res.status(401).json("Người dùng đã tồn tại");
        }

        // 3. bcrypt password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(matkhau, salt);

        // 4. enter new user
        const newUser = await
            pool.query("INSERT INTO nhanvien(ten_nv, chucdanh, vitri, sdt, hrm, matkhau, phanquyen)"
                + "VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [ten_nv, chucdanh, vitri, sdt, hrm, bcryptPassword, phanquyen]);

        // token
        // const token = jwtGenerator(newUser.rows[0].user_id);
        // res.json({ token });
        res.status(200).json("Thêm nhân viên thành công!!");

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});





// login
router.post("/login", validInfo, async (req, res) => {
    try {
        // 1. destructure req.body
        const { hrm, matkhau } = req.body;
        // 2. check user
        const user = await pool.query("SELECT * FROM nhanvien WHERE hrm = $1", [hrm]);
        if (user.rows.length === 0) {
            return res.status(401).json("Người dùng không tồn tại");
        }
        // 3. check password
        const validPassword = await bcrypt.compare(matkhau, user.rows[0].matkhau);
        if (!validPassword) {
            return res.status(401).json("Mật khẩu không đúng");
        }

        // token
        const token = jwtGenerator(user.rows[0].ma_nv);
        res.status(200).json({ token });


    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})

// 

router.get("/is-verify", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})






module.exports = router;