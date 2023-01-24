import mysql from "mysql2/promise";

const pool = mysql.createPool({
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
            "CREATE TABLE stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE, time TIME)"
        );
        await con.query(
            "CREATE TABLE real_time_stocks (id INT AUTO_INCREMENT PRIMARY KEY, company_id INT, price FLOAT, date DATE)"
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
    console.log("Database created");
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
    console.log("Companies inserted");
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

let seed = 100;
const generateData = async () => {
    await insertCompanies();

    const con = await pool.getConnection();

    let currentDate = new Date();
    let lastMonth = new Date();

    const insertStock = `INSERT INTO stocks (company_id, price, date) VALUES ?`;
    const inserts = [];
    let count = await getCompaniesCount();
    // console.log(count);
    for (let j = 0; j < count; j++) {
        lastMonth.setMonth(currentDate.getMonth() - 1);
        while (lastMonth <= currentDate) {
            let company_id = j + 1;
            for (let i = 0; i < 1440; i++) {
                seed = f(seed);
                let date =
                    lastMonth.getFullYear() +
                    "-" +
                    (lastMonth.getMonth() + 1) +
                    "-" +
                    lastMonth.getDate();
                inserts.push([company_id, seed, date]);
            }
            // company_id % 10 === 0 ? (company_id = 1) : company_id++;
            lastMonth.setDate(lastMonth.getDate() + 1);
        }
    }

    await con.query(insertStock, [inserts]);
    con.release();
    console.log("Stocks inserted");
};
generateData();
