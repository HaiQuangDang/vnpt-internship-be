const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");


// insert 1 single row into congviec
router.post("/insert-row", async (req, res) => {
    try {
        // 1. destructure req.body
        const { ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat } = req.body;

        // 2. enter new row
        const newPlan = await
            pool.query("INSERT INTO congviec (ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat)"
                + "VALUES ($1, $2, $3, to_date($4, 'YYYY-MM'), $5, $6) RETURNING *;",
                [ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat]);

        res.status(200).json("Thêm kế hoạch thành công!");

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

// insert by import file into congviec
router.post("/import-congviec", async (req, res) => {
    try {
        const data = req.body.data;
        const GET_ten_nguoi_cap_nhat = req.body.ten_nguoi_cap_nhat;

        for (let i = 0; i < data.length; i++) {
            const hrm = data[i]['Mã HRM'];
            const getMa_nv = await pool.query("SELECT ma_nv FROM nhanvien WHERE hrm=$1", [hrm]);
            const ma_dv_display = data[i]['Mã dịch vụ'];
            const getMa_dv = await pool.query("SELECT ma_dv FROM dichvu WHERE ma_dv_display=$1", [ma_dv_display]);


            const ten_ke_hoach = data[i]['Tên kế hoạch'];
            const thang = data[i]['Tháng'];
            const chi_tieu = data[i]['Chỉ tiêu'];
            const ten_nguoi_cap_nhat = GET_ten_nguoi_cap_nhat;

            const query = "INSERT INTO congviec (ma_nv, ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat) VALUES ($1, $2, $3, to_date($4, 'YYYY-MM'), $5, $6)";
            const values = [getMa_nv.rows[0].ma_nv, getMa_dv.rows[0].ma_dv, ten_ke_hoach, thang, chi_tieu, ten_nguoi_cap_nhat];
            await pool.query(query, values);
        }

        res.status(200).json("Thêm file thành công!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to insert data' });
    }
});


// update 1 single row
router.put("/update-row/:ma_congviec", async (req, res) => {
    try {
        const ma_congviec = req.params.ma_congviec;
        // 1. destructure req.body
        const { thuc_hien, doanh_thu, ten_nguoi_cap_nhat } = req.body;
        // 2. enter new row
        const newPlan = await
            pool.query("UPDATE congviec SET thuc_hien = $1, doanh_thu= $2, ten_nguoi_cap_nhat=$3 WHERE ma_congviec = $4",
                [thuc_hien, doanh_thu, ten_nguoi_cap_nhat, ma_congviec]);
        res.status(200).json("Cập nhật thành công!");

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

// update by import file into congviec
router.put("/update-congviec", async (req, res) => {
    try {
        const data = req.body.data;
        const GET_ten_nguoi_cap_nhat = req.body.ten_nguoi_cap_nhat
        for (let i = 0; i < data.length; i++) {
            const ma_congviec = data[i]['Mã kế hoạch'];
            const thuc_hien = data[i]['Thực hiện'];
            const doanh_thu = data[i]['Doanh thu'];
            const ten_nguoi_cap_nhat = GET_ten_nguoi_cap_nhat;

            const query = "UPDATE congviec SET thuc_hien = $1, doanh_thu= $2, ten_nguoi_cap_nhat=$3 WHERE ma_congviec = $4";
            const values = [thuc_hien, doanh_thu, ten_nguoi_cap_nhat, ma_congviec];
            await pool.query(query, values);
        }

        res.status(200).json("Cập nhật thành công!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to insert data' });
    }
});

// delete cong viec
router.delete("/delete/:ma_congviec", authorization, async (req, res) => {
    try {
        const ma_congviec = req.params.ma_congviec;
        await pool.query("DELETE FROM congviec WHERE ma_congviec=$1", [ma_congviec]);
        res.status(200).json("Đã xóa thành công!");
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});


// get all user
router.get("/select-users", authorization, async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM nhanvien WHERE phanquyen != 1");
        res.json(users.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})

router.get("/select-services", authorization, async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM dichvu");
        res.json(users.rows);
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
})

// update user
router.put("/update-user/:ma_nv", async (req, res) => {
    try {
        const ma_nv = req.params.ma_nv;
        // 1. destructure req.body
        const { update_chucdanh, update_vitri, update_sdt, update_phanquyen } = req.body;

       await pool.query("UPDATE nhanvien SET chucdanh=$1, vitri=$2, sdt=$3, phanquyen=$4 WHERE ma_nv=$5",
                [update_chucdanh, update_vitri, update_sdt, update_phanquyen, ma_nv]);

        res.status(200).json("Cập nhật thành công!");
        // res.json(chucdanh, vitri, sdt, phanquyen );

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

// delete user
router.delete("/delete-user/:ma_nv", authorization, async (req, res) => {
    try {
        const ma_nv = req.params.ma_nv;
        await pool.query("DELETE FROM nhanvien WHERE ma_nv=$1", [ma_nv]);
        res.status(200).json("Đã xóa thành công!");
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Hãy xóa các kế hoạch của nhân viên này trước!!");
    }
});


// insert service
router.post("/add-service", async (req, res) => {
    try {
        // 1. destructure req.body
        const { ten_dv, ma_dv_display } = req.body;

        // 2. enter new row
        const newPlan = await
            pool.query("INSERT INTO dichvu (ten_dv, ma_dv_display) VALUES ($1, $2)",
                [ten_dv, ma_dv_display]);

        res.status(200).json("Thêm dịch vụ thành công!");

    } catch (error) {
        console.error(error.message);
        res.status(500).json("Server Error");
    }
});

// delete service
router.delete("/delete-serice/:ma_dv", async (req, res) => {
    try {
        const ma_dv = req.params.ma_dv;
        await pool.query("DELETE FROM dichvu WHERE ma_dv=$1", [ma_dv]);
        res.status(200).json("Đã xóa thành công!");
    } catch (error) {
        console.error(error.message);
        res.status(500).json("Dịch vụ này vẫn đang được thực hiện!!");
    }
});




module.exports = router;