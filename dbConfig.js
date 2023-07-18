const { response, json } = require('express');
const config = require('./db');
const sql = require('mssql');
const utill = require('./utill');
const bcrypt = require('bcryptjs');

async function getteamdetails() {
  try {
    let pool = await sql.connect(config);
    let getData = await pool.request().query('SELECT * FROM TEAM_EMP');
    return getData.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addOneEmploye(data) {
  console.log(data);
  try {
    let pool = await sql.connect(config);
    let addData = await pool
      .request()
      .input('INPUT', sql.VarChar, data.INPUT)
      .input('EMPID', sql.Int, data.EMPID)
      .input('ENAME', sql.VarChar, data.ENAME)
      .input('JOB', sql.VarChar, data.JOB)
      .input('TEAM', sql.VarChar, data.TEAM)
      .input('MANAGER', sql.Int, data.MANAGER)
      .input('SALARY', sql.Float, data.SALARY)
      .input('DATEOFJOIN', sql.VarChar, data.DATEOFJOIN)
      .input('DATEOFLEAVE', sql.VarChar, data.DATEOFLEAVE)
      .input('STATUS', sql.VarChar, data.STATUS)
      .input('ADDED_BY', sql.Int, data.ADDED_BY)
      .execute('USP_TEAMS');
    return addData.recordsets;
  } catch (error) {
    console.log(error);
    // response.json(utill, responseErrorJSON(401, "error", error));
  }
}

async function getManagers() {
  try {
    let pool = await sql.connect(config);
    let mgrdata = await pool
      .request()
      .query('SELECT DISTINCT EMP_ID FROM TEAM_EMP');
    return mgrdata.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function addUser(data) {
  try {
    var salt = bcrypt.genSaltSync(5);
    let hashpassword = bcrypt.hashSync(data.password, salt);

    let pool = await sql.connect(config);
    await pool.query(
      "INSERT INTO USERS (USER_NAME, USER_PASSWORD) VALUES ('" +
        data.uname +
        "','" +
        hashpassword +
        "')"
    );
  } catch (error) {
    console.log(error);
  }
}

async function userlogin(data) {
  try {
    let pool = await sql.connect(config);
    const result1 = await pool
      .request()
      .query("SELECT * FROM USERS WHERE USER_NAME = '" + data.username + "'");

    if (result1.recordset.length != 0) {
      const matches = await Promise.all(
        result1.recordset.map(async (user) => {
          return new Promise((resolve, reject) => {
            bcrypt.compare(data.password, user.USER_PASSWORD, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        })
      );

      console.log('Matches: ', matches);

      if (matches.includes(true)) {
        return result1; // Username and password match found
      } else {
        return false; // Incorrect password
      }
    } else {
      return JSON.stringify('Username not found');
    }

    // if (result1.recordset.length != 0) {
    //   const result2 = await new Promise((resolve, reject) => {
    //     bcrypt.compare(data.password, result1.recordset[0].USER_PASSWORD, (err, result) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(result);
    //       }
    //     });
    //   });

    //   console.log("result 2: ", result2);
    //   return result2;
    // } else {
    //   return JSON.stringify("User Name Not Found.");
    // }
  } catch (error) {
    console.log('error: ', error);
  }
}

module.exports = {
  getteamdetails: getteamdetails,
  addOneEmploye: addOneEmploye,
  getManagers: getManagers,
  addUser: addUser,
  userlogin: userlogin,
};
