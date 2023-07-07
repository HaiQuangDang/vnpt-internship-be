module.exports = (req, res, next) => {
  const { ten_nv, chucdanh, vitri, sdt, hrm, matkhau} = req.body;

  // function validEmail(userEmail) {
  //   return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  // }

  if (req.path === "/register") {
    if (![ten_nv, chucdanh, vitri, sdt, hrm, matkhau].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
    /*else if (!validEmail(email)) {
      return res.status(401).json("Invalid Email");
    } */
  } else if (req.path === "/login") {
    if (![hrm, matkhau].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }

  next();
};