CREATE DATABASE VNPT;

CREATE TABLE nhanvien (
	ma_nv SERIAL PRIMARY KEY,
	ten_nv VARCHAR(255) NOT NULL,
	chucdanh VARCHAR(255),
	vitri VARCHAR(255),
	sdt VARCHAR(255),
	HRM VARCHAR(255) NOT NULL,
	matkhau VARCHAR(255) NOT NULL,
	ghichu VARCHAR(255),
	phanquyen SMALLINT DEFAULT 0
);

CREATE TABLE dichvu (
	ma_dv SERIAL PRIMARY KEY,
	ten_dv VARCHAR(255) NOT NULL,
  ma_dv_display VARCHAR(255) NOT NULL
);

INSERT INTO dichvu(ten_dv, ma_dv_display) VALUES ('Sim di động', 'SIM101VNP');
INSERT INTO dichvu(ten_dv, ma_dv_display) VALUES ('Internet - Wifi', 'WIF102VNP');
INSERT INTO dichvu(ten_dv, ma_dv_display) VALUES ('Công nghệ thông tin', 'CNT103VNP');

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE congviec (
  ma_congviec VARCHAR(6) PRIMARY KEY DEFAULT substring(uuid_generate_v4()::text, 1, 6) NOT NULL,
  ma_nv INTEGER NOT NULL,
  ma_dv INTEGER NOT NULL,
  ten_ke_hoach VARCHAR(255) NOT NULL,
  thang DATE NOT NULL,
  chi_tieu INTEGER NOT NULL,
  ten_nguoi_cap_nhat VARCHAR(255) NOT NULL,
  thuc_hien INTEGER DEFAULT 0,
  con_lai INTEGER,
  doanh_thu FLOAT DEFAULT 0,
  ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_dichvu FOREIGN KEY(ma_dv) REFERENCES dichvu(ma_dv),
  CONSTRAINT fk_nhanvien FOREIGN KEY(ma_nv) REFERENCES nhanvien(ma_nv)
);

CREATE OR REPLACE FUNCTION update_con_lai_ty_le()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.con_lai := NEW.chi_tieu - NEW.thuc_hien;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_con_lai_ty_le_trigger
  BEFORE INSERT OR UPDATE ON congviec
  FOR EACH ROW
  EXECUTE FUNCTION update_con_lai_ty_le();
  
CREATE OR REPLACE FUNCTION update_ngay_cap_nhat()
  RETURNS TRIGGER AS $$
BEGIN
  NEW.ngay_cap_nhat := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ngay_cap_nhat_trigger
  BEFORE UPDATE ON congviec
  FOR EACH ROW
  EXECUTE FUNCTION update_ngay_cap_nhat();





-- INSERT INTO congviec (thang) VALUES (to_date('2023-06', 'YYYY-MM'));



