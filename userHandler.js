const database = require("./database");


  const getUsers = (req, res) => {

    let sql = "select id,firstname, lastname,email,city,language from users";

    const sqlValues = [];
    
    
    if (req.query.language != null) {
    
      sql += " where language = ?";
    
      sqlValues.push(req.query.language);
    
    
      if (req.query.city != null) {
    
        sql += " and city = ?";
    
        sqlValues.push(req.query.city);
    
      }
    
    } else if (req.query.city != null) {
    
      sql += " where city = ?";
    
      sqlValues.push(req.query.city);
    
    }
  
  database
  
  .query(sql, sqlValues)
  
  .then(([users]) => {
  
    res.json(users);
  
  })
  
  .catch((err) => {
  
    console.error(err);
  
    res.status(500).send("Error retrieving data from database");
  
  });
  
  };

const getUserById = (req, res) => {

    const id = parseInt(req.params.id);
  
  
    database
  
      .query("select id,firstname, lastname,email,city,language from users where id = ?", [id])
  
      .then(([users]) => {
  
        if (users[0] != null) {
  
          res.status(200).json(users[0]);
  
        } else {
  
          res.status(404).send("Not Found");
  
        }
  
      })
  
      .catch((err) => {
  
        console.error(err);
  
        res.status(500).send("Error retrieving data from database");
  
      });
  
  };

  const postUser = (req, res) => {
    const { firstname, lastname, email, city, language , hashedPassword} = req.body;
    console.log("Data received from the request body:");
  console.log("firstname:", firstname);
  console.log("lastname:", lastname);
  console.log("email:", email);
  console.log("city:", city);
  console.log("language:", language);
  console.log("hashedPassword:", hashedPassword);  
    database
  
      .query(
  
        "INSERT INTO users(firstname, lastname, email, city, language , hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
  
        [firstname, lastname, email, city, language, hashedPassword]
  
      )
  
      .then(([result]) => {
  
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
  
      })
  
      .catch((err) => {
  
        console.error(err);
  
        res.status(500).send("Error saving the user");
  
      });
  
  };

  const editUser = (req, res) =>{
    const id = parseInt(req.params.id);
  
    const { firstname, lastname, email, city, language, hashedPassword  } = req.body;
  
    database
  
      .query(
  
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword= ? where id = ?",
  
        [firstname, lastname, email, city, language, hashedPassword, id ]
  
      )
  
      .then(([result]) => {
  
        if (result.affectedRows === 0) {
  
          res.status(404).send("Not Found");
  
        } else {
  
          res.sendStatus(204);
  
        }
  
      })
  
      .catch((err) => {
  
        console.error(err);
  
        res.status(500).send("Error editing the user");
  
      });
  
  };
const deleteUser = (req , res ) => {
  const id = parseInt(req.params.id);

database
  .query(
    "delete from users where id = ? ",[id]
  )
  .then(([result]) =>{
    if(result.affectedRows === 0 ){
      res.status(404).sens("Not found");
    }else{
      res.sendStatus(204);
    }
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send("Error deleting user");
  })
}

module.exports = {
    getUsers,
    getUserById,
    postUser,
    editUser,
    deleteUser
  };