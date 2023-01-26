import mysql from "mysql";
import mysql2 from "mysql2";

const con = mysql2.createConnection({
    host: "127.0.0.1",
    user: "sail",
    password: "password",
    database: "stock_exchange",
});

const createSqlStatements = (query) => {
    con.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
    });
};
const createDb = (insertdata) => {
    let deleteTables = `DROP TABLE IF EXISTS companies, stocks, real_time_stocks`;
    //
    let companies = `CREATE TABLE companies (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`;
    let stocks = `CREATE TABLE stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE)`;
    let realTimeStocks = `CREATE TABLE real_time_stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE)`;
    let addStocksFKeys = `ALTER TABLE stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)`;
    let addRealTimeStocksFKeys = `ALTER TABLE real_time_stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)`;

    // delete tables
    createSqlStatements(deleteTables);
    // create tables
    createSqlStatements(companies);
    createSqlStatements(stocks);
    createSqlStatements(realTimeStocks);
    createSqlStatements(addStocksFKeys);
    createSqlStatements(addRealTimeStocksFKeys);
    // insert data
};
createDb();

const insertCompanies = () => {
    const companies = [
        "bbva",
        "santander",
        "repsol",
        "iberdrola",
        "inditex",
        "caixabank",
        "cellnex",
        "naturgy",
        "telefonica",
        "ferrovial",
    ];

    companies.forEach((company) => {
        con.query(
            `INSERT INTO companies (name) VALUES ('${company}')`,
            (err, result) => {
                if (err) throw err;
            }
        );
    });
    return companies.length;
};
const volatility = 0.02;

const f = (old_price) => {
    const rnd = Math.random() - 0.4982;
    const change_percent = 2 * volatility * rnd;
    const change_amount = old_price * change_percent;
    const new_price = old_price + change_amount;

    if (new_price < 0.01) return new_price + Math.abs(change_amount) * 2;
    else if (new_price > 1000) return new_price - Math.abs(change_amount) * 2;

    return new_price;
};

let seed = 100;
const generateData = () => {
    let currentDate = new Date();
    // let lastYear = new Date();
    let lastMonth = new Date();
    // lastYear.setFullYear(currentDate.getFullYear() - 1);
    lastMonth.setMonth(currentDate.getMonth() - 1);
    while (lastMonth <= currentDate) {
        let company_id = 1;
        for (let i = 0; i < 1440; i++) {
            //generate 1440 minutes of data
            seed = f(seed);
            let query = `INSERT INTO stocks (company_id, price, date) VALUES (${company_id}, ${seed}, '${
                lastMonth.getFullYear() +
                "-" +
                (lastMonth.getMonth() + 1) +
                "-" +
                lastMonth.getDate()
            }')`;
            createSqlStatements(query);
        }
        company_id++;
        lastMonth.setDate(lastMonth.getDate() + 1);
    }
};

const insertStocksData = (callback) => {
    let count = insertCompanies();
    for (let i = 0; i < count; i++) {
        callback();
    }
    console.log("data inserted");
};
insertStocksData(generateData);

////////////////////////////////////////////////
// import mysql from "mysql2/promise";

// const pool = mysql.createPool({
//     host: "127.0.0.1",
//     user: "sail",
//     password: "password",
//     database: "stock_exchange",
//     connectionLimit: 10,
// });

// const createDb = async () => {
//     try {
//         const con = await pool.getConnection();
//         await con.query(
//             "DROP TABLE IF EXISTS companies, stocks, real_time_stocks"
//         );
//         await con.query(
//             "CREATE TABLE companies (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))"
//         );
//         await con.query(
//             "CREATE TABLE stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, datetime Datetime)"
//         );
//         await con.query(
//             "CREATE TABLE real_time_stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE)"
//         );
//         await con.query(
//             "ALTER TABLE stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)"
//         );
//         await con.query(
//             "ALTER TABLE real_time_stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)"
//         );
//         con.release();
//     } catch (err) {
//         console.log(err);
//     }
//     console.log("Database created");
// };

// const insertCompanies = async () => {
//     await createDb();

//     try {
//         const con = await pool.getConnection();
//         const companies = [
//             "bbva",
//             "santander",
//             "repsol",
//             "iberdrola",
//             "inditex",
//             "caixabank",
//             "cellnex",
//             "naturgy",
//             "telefonica",
//             "ferrovial",
//         ];
//         let values = companies.map((name) => `('${name}')`).join(",");
//         await con.query(`INSERT INTO companies (name) VALUES ${values}`);
//         con.release();
//         return companies.length;
//     } catch (err) {
//         console.log(err);
//     }
//     console.log("Companies inserted");
// };

// const volatility = 0.02;

// const f = (old_price) => {
//     const rnd = Math.random() - 0.4982;
//     const change_percent = 2 * volatility * rnd;
//     const change_amount = old_price * change_percent;
//     const new_price = old_price + change_amount;

//     if (new_price < 0.01) return new_price + Math.abs(change_amount) * 2;
//     else if (new_price > 1000) return new_price - Math.abs(change_amount) * 2;

//     return new_price;
// };

// let seed = 100;
// const generateData = async () => {
//     await insertCompanies();

//     const con = await pool.getConnection();

//     let currentDate = new Date();
//     let lastMonth = new Date();

//     lastMonth.setMonth(currentDate.getMonth() - 1);

//     const insertStock = `INSERT INTO stocks (company_id, price, datetime) VALUES ?`;
//     let company_id = 1;
//     const inserts = [];
//     while (lastMonth <= currentDate) {
//         for (let i = 0; i < 1440; i++) {
//             seed = f(seed);
//             let date =
//                 lastMonth.getFullYear() +
//                 "-" +
//                 (lastMonth.getMonth() + 1) +
//                 "-" +
//                 lastMonth.getDate();
//             " " +
//                 lastMonth.getHours() +
//                 ":" +
//                 lastMonth.getMinutes() +
//                 ":" +
//                 lastMonth.getSeconds();
//             inserts.push([company_id, seed, date]);
//             lastMonth.setMinutes(lastMonth.getMinutes() + 1);
//         }
//         lastMonth.setDate(lastMonth.getDate() + 1);

//         company_id % 10 === 0 ? (company_id = 1) : company_id++;
//     }

//     await con.query(insertStock, [inserts]);
//     con.release();
//     console.log("Stocks inserted");
// };
// generateData();

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

// import mysql from "mysql2/promise";

// const NOW = new Date(new Date().setSeconds(0));

// const pool = mysql.createPool({
//     host: "127.0.0.1",
//     user: "sail",
//     password: "password",
//     database: "stock_exchange",
//     connectionLimit: 10,
// });

// const createDb = async () => {
//     try {
//         const con = await pool.getConnection();
//         await con.query("DROP TABLE IF EXISTS companies, stocks cascade");
//         await con.query(
//             "CREATE TABLE companies (id INT PRIMARY KEY, name VARCHAR(255))"
//         );
//         await con.query(
//             "CREATE TABLE stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATETIME)"
//         );

//         con.release();
//     } catch (err) {
//         console.log(err);
//     }
//     console.log("Database created");
// };

// const companies = [
//     "bbva",
//     "santander",
//     "repsol",
//     "iberdrola",
//     "inditex",
//     "caixabank",
//     "cellnex",
//     "naturgy",
//     "telefonica",
//     "ferrovial",
// ];

// const insertCompanies = async () => {
//     await createDb();

//     try {
//         const con = await pool.getConnection();

//         let values = companies
//             .map((name, id) => `(${id}, '${name}')`)
//             .join(",");
//         await con.query(`INSERT INTO companies (id, name) VALUES ${values}`);
//         con.release();
//         return companies.length;
//     } catch (err) {
//         console.log(err);
//     }
//     console.log("Companies inserted");
// };

// const volatility = 0.02;

// const f = (old_price) => {
//     const rnd = Math.random() - 0.498;
//     const change_percent = 2 * volatility * rnd;
//     const change_amount = old_price * change_percent;
//     const new_price = old_price + change_amount;

//     if (new_price < 0.01) return new_price + Math.abs(change_amount) * 2;
//     else if (new_price > 1000) return new_price - Math.abs(change_amount) * 2;

//     return new_price;
// };
// const getCompaniesCount = async () => {
//     const con = await pool.getConnection();
//     const [rows] = await con.query("SELECT COUNT(*) FROM companies");
//     con.release();
//     return rows[0]["COUNT(*)"];
// };

// let seed = 100;

// const unfold = (seed, fn, n) => {
//     let result = [];
//     for (let i = 0; i < n; i++) {
//         result.push(seed);
//         seed = fn(seed);
//     }
//     return result;
// };

// const ENTRIES_PER_COMPANY = 45000;

// const generateData = () => unfold(100, f, ENTRIES_PER_COMPANY);

// const generateCompanyData = (id) => {
//     return generateData().map((price, offset) => [
//         id,
//         price,
//         substractMinutesFromDate(NOW, ENTRIES_PER_COMPANY - offset + 1),
//     ]);
// };

// const substractMinutesFromDate = (date, minutes) => {
//     return new Date(date.getTime() - minutes * 60000);
// };

// console.log(generateCompanyData(0));

// const withConnection = async (fn) => {
//     const con = await pool.getConnection();
//     await fn(con);
//     con.release();
// };

// const insertCompanyData = async (id) => {
//     const data = generateCompanyData(id);
//     await withConnection(async (con) => {
//         const query = `INSERT INTO stocks (company_id, price, date) VALUES ?`;
//         await con.query(query, [data]);
//     });
// };

// const insertCompaniesData = async () => {
//     const ids = companies.map((_, id) => id);
//     const inserts = ids.map((id) => insertCompanyData(id));
//     await Promise.all(inserts);
// };

// console.time("Benchmark");

// await createDb();
// await insertCompaniesData();

// console.timeEnd("Benchmark");
