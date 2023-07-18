const express = require('express');
const bodyparser = require('body-parser');
const dbdata = require('./dbconfig');
const cors = require('cors');
const app = express();
const router = express.Router();
const port = 3000;
const utill = require('./utill');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());
app.use('/Teams', router);

router.route('/getTeamDetails').get((req, res) => {
  dbdata.getteamdetails().then((result) => {
    res.send(result);
  });
});

router.route('/addEmploye').post((req, res) => {
  let employe = { ...req.body };
  dbdata.addOneEmploye(employe).then((result) => {
    res.send('0');
  });
});

router.route('/getManagers').get((req, res) => {
  dbdata.getManagers().then((result) => {
    res.send(result[0]);
    console.log('getmanagers : ', result);
  });
});

router.route('/signUp').post((req, res) => {
  let user = { ...req.body };
  dbdata.addUser(user).then((result) => {
    res.send('0');
    // console.log(result);
  });
});

router.route('/userLogin').post((req, res) => {
  let user = { ...req.body };
  dbdata.userlogin(user).then((result) => {
    console.log('output : ', result);
    res.send(JSON.stringify(result));
  });
});

app.listen(port);
console.log('APIs are running on port ' + port);
