import mysql from "mysql2/promise";

const db = async ({ query, values = [] }) => {
  const dbConnection = await mysql.createConnection({
    host: "localhost",
    database: "ssrtable",
    user: "root",
    // password: process.env.PASSWORD,
    password: "",
  });

  try {
    const [results] = await dbConnection.execute(query, values);
    dbConnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    // return { error };
  }
};

export default db;
