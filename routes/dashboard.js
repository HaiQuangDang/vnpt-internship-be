const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


router.get("/", authorization, async (req, res) => {
    try {
        // after passing middleware req.user has payload
        // res.json(req.user);
        const user = await pool.query("SELECT * FROM nhanvien WHERE ma_nv = $1", [req.user]);
        res.json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})

router.get("/home", authorization, async (req, res) => {
    try {
        const role = await pool.query("SELECT phanquyen FROM nhanvien WHERE ma_nv = $1", [req.user]);
        if (role.rows[0].phanquyen !== 0) {
            const user = await pool.query("SELECT  congviec.*, nhanvien.ten_nv, nhanvien.hrm, dichvu.ten_dv, dichvu.ma_dv_display FROM congviec INNER JOIN nhanvien ON congviec.ma_nv=nhanvien.ma_nv INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv ORDER BY ngay_cap_nhat DESC");
            res.json(user.rows);
        }
        else {
            const user = await pool.query("SELECT  congviec.*, dichvu.ten_dv FROM congviec INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv WHERE ma_nv = $1 ORDER BY ngay_cap_nhat DESC", [req.user]);
            // res.json(user.rows[0]);
            res.json(user.rows);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})

router.get("/services/:ma_dv", authorization, async (req, res) => {
    try {
        const ma_dv = req.params.ma_dv;
        const role = await pool.query("SELECT phanquyen FROM nhanvien WHERE ma_nv = $1", [req.user]);
        if (role.rows[0].phanquyen !== 0) {
            const user = await pool.query("SELECT congviec.*, nhanvien.ten_nv, nhanvien.hrm, dichvu.ten_dv, dichvu.ma_dv_display FROM congviec INNER JOIN nhanvien ON congviec.ma_nv=nhanvien.ma_nv INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv WHERE congviec.ma_dv=$1 ORDER BY ngay_cap_nhat DESC", [ma_dv]);
            res.json(user.rows);
        }
        else {
            const user = await pool.query("SELECT  congviec.*, dichvu.ten_dv FROM congviec INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv WHERE ma_nv = $1 AND congviec.ma_dv=$2 ORDER BY ngay_cap_nhat DESC", [req.user, ma_dv]);
            // res.json(user.rows[0]);
            res.json(user.rows);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})


router.get("/services", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM dichvu");
        res.json(user.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})



router.get("/detail/:ma_congviec", authorization, async (req, res) => {
    try {
        const ma_congviec = req.params.ma_congviec;
        const role = await pool.query("SELECT phanquyen FROM nhanvien WHERE ma_nv = $1", [req.user]);
        if (role.rows[0].phanquyen !== 0) {
            const user = await pool.query("SELECT  congviec.*, nhanvien.ten_nv, dichvu.ten_dv FROM congviec INNER JOIN nhanvien ON congviec.ma_nv=nhanvien.ma_nv INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv WHERE congviec.ma_congviec=$1", [ma_congviec]);
            res.json(user.rows[0]);
        }
        else {
            const user = await pool.query("SELECT  congviec.*, dichvu.ten_dv FROM congviec INNER JOIN dichvu ON congviec.ma_dv=dichvu.ma_dv  WHERE congviec.ma_congviec=$1", [ma_congviec]);
            res.json(user.rows[0]);
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})


module.exports = router;