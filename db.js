const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "vnptBM@2023internship",
    host: "db.uauwwztfsvoxxldgzugm.supabase.co",
    port: 5432,
    database: "postgres"
});


module.exports = pool;