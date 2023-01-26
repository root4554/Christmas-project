import mysql from "mysql2/promise";
import cron from "node-cron";

const pool = mysql.createPool({
    // host: "mysql",
    host: "127.0.0.1",
    user: "sail",
    password: "password",
    database: "stock_exchange",
    connectionLimit: 10,
});

const createDb = async () => {
    try {
        const con = await pool.getConnection();
        await con.query(
            "DROP TABLE IF EXISTS companies, stocks, real_time_stocks"
        );
        await con.query(
            "CREATE TABLE companies (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))"
        );
        await con.query(
            "CREATE TABLE stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date Date, time Time)"
        );
        await con.query(
            "CREATE TABLE real_time_stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE, time TIME)"
        );
        await con.query(
            "ALTER TABLE stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)"
        );
        await con.query(
            "ALTER TABLE real_time_stocks ADD FOREIGN KEY (company_id) REFERENCES companies(id)"
        );
        con.release();
    } catch (err) {
        console.log(err);
    }
    console.log("Database created,");
    console.log("starting to insert companies...");
};

const insertCompanies = async () => {
    await createDb();

    try {
        const con = await pool.getConnection();
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
        let values = companies.map((name) => `('${name}')`).join(",");
        await con.query(`INSERT INTO companies (name) VALUES ${values}`);
        con.release();
        return companies.length;
    } catch (err) {
        console.log(err);
    }
    console.log("Companies inserted...");
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
const getCompaniesCount = async () => {
    const con = await pool.getConnection();
    const [rows] = await con.query("SELECT COUNT(*) FROM companies");
    con.release();
    return rows[0]["COUNT(*)"];
};
// const random = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1) + min);
// };

const insertStockData = async () => {
    let seed = 100;
    await insertCompanies();
    const con = await pool.getConnection();
    let currentDate = new Date();
    let lastMonth = new Date();
    const insertStock = `INSERT INTO stocks (company_id, price, date, time) VALUES ?`;
    const inserts = [];
    let count = await getCompaniesCount();
    for (let j = 0; j < count; j++) {
        lastMonth.setMonth(currentDate.getMonth() - 1);
        while (lastMonth < currentDate) {
            let company_id = j + 1;
            for (let i = 0; i < 2; i++) {
                seed = f(seed);
                let date =
                    lastMonth.getFullYear() +
                    "-" +
                    (lastMonth.getMonth() + 1) +
                    "-" +
                    lastMonth.getDate();
                let time =
                    lastMonth.getHours() +
                    ":" +
                    lastMonth.getMinutes() +
                    ":" +
                    "00";
                inserts.push([company_id, seed, date, time]);
                lastMonth.setMinutes(lastMonth.getMinutes() + 1);
            }
        }
        lastMonth.setDate(lastMonth.getDate() + 1);
    }
    await con.query(insertStock, [inserts]);
    console.log("Stocks inserted...");
    con.release();
};
const selectLastData = async (id) => {
    const con = await pool.getConnection();
    const selectlastHistoryData = `SELECT * FROM stocks WHERE company_id = ${id} ORDER BY id DESC LIMIT 1`;
    const selectlastRealTimeData = `SELECT * FROM real_time_stocks  WHERE company_id = ${id} ORDER BY id DESC LIMIT 1`;
    const [history] = await con.query(selectlastHistoryData);
    const [realTime] = await con.query(selectlastRealTimeData);
    con.release();
    console.log(history);
    return [history, realTime];
};

const insertRealTimeStock = async () => {
    const con = await pool.getConnection();
    const insertRealTimeStock = `INSERT INTO real_time_stocks (company_id, price, date, time) VALUES ?`;
    const inserts = [];
    let count = await getCompaniesCount();
    for (let j = 0; j < count; j++) {
        let seed = await selectLastData(j + 1);
        seed = seed[1][0].price;
        console.log("Last price of id " + j + " " + seed);
        let company_id = j + 1;
        seed = f(seed);
        let date = new Date();
        let time = date.getHours() + ":" + date.getMinutes() + ":" + "00";
        inserts.push([company_id, seed, date, time]);
    }
    await con.query(insertRealTimeStock, [inserts]);
    con.release();
    console.log("Real time stocks inserted...");
};
const insertAllData = async () => {
    await insertStockData();
    cron.schedule("*/1 * * * *", async () => {
        insertRealTimeStock();
    });
    await selectLastData(1);
    console.log("All data inserted .");
};
const start = performance.now();
await insertAllData();
const end = performance.now();
console.log("Time: " + (end - start) / 1000 + "s");
