const mysql = require("mysql2");
//connection pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
async function view(req, res) {
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } // not connected!
    console.log("Database is connected.... " + connection.threadId);
    //user the connection
    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, rows) => {
        //when done with the connection  release it,
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
//find user by search
async function find(req, res) {
  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } // not connected!
    console.log("Database is connected.... " + connection.threadId);
    let searchTerm = req.body.search;
    console.log(searchTerm);
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ? ",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
async function form(req, res) {
  res.render("add-user");
}
//add new user
async function create(req, res) {
  pool.getConnection((err, connection) => {
    //destructuring the data
    const { first_name, last_name, email, phone, comments } = req.body;
    let searchTerm = req.body.search;

    // User the connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?",
      [first_name, last_name, email, phone, comments],
      (err, rows) => {
        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
}

//edit user
async function edit(req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } // not connected!
    console.log("Database is connected.... " + connection.threadId);
    let searchTerm = req.body.search;
    console.log(searchTerm);
    connection.query(
      "SELECT * FROM user WHERE id = ? ",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
//update user
async function update(req, res) {
  const { first_name, last_name, email, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } // not connected!
    console.log("Database is connected.... " + connection.threadId);
    let searchTerm = req.body.search;
    console.log(searchTerm);
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ? ",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) {
              throw err;
            }
            console.log("Database is connected.... " + connection.threadId);
            let searchTerm = req.body.search;
            console.log(searchTerm);
            connection.query(
              "SELECT * FROM user WHERE id = ? ",
              [req.params.id],
              (err, rows) => {
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been updated.`,
                  });
                } else {
                  console.log(err);
                }
                console.log("the data from user table: \n", rows);
              }
            );
          });
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
//delete user
async function deleteUser(req, res) {
  // pool.getConnection((err, connection)=>{
  //     if(err){throw err;}// not connected!
  //       console.log("Database is connected.... "+ connection.threadId );
  //     let searchTerm = req.body.search;
  //     console.log(searchTerm);
  //       //user the connection
  //   connection.query('DELETE FROM user WHERE id = ? ',[req.params.id], (err,rows)=>{
  //      //when done with the connection  release it,
  //      connection.release();
  //      if(!err){
  //          res.redirect('/');//redirects to home page
  //      }
  //      else{
  //          console.log(err)
  //      }
  //      console.log('the data from user table: \n',rows);
  //     });
  //   });

  //connect to DB
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } 
    console.log("Database is connected.... " + connection.threadId);
    connection.query(
      "UPDATE user SET status = ? WHERE id = ? ",
      ["removed", req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.redirect("/");
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
async function viewuser(req, res) {
  pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    } 
    console.log("Database is connected.... " + connection.threadId);
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("the data from user table: \n", rows);
      }
    );
  });
}
module.exports = {
  view,
  find,
  form,
  create,
  edit,
  update,
  deleteUser,
  viewuser,
};
