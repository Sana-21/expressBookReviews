const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!doesExist(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

function getBooks(){
  return books;
}
// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      let booksData = await getBooks(); 
      res.status(200).json(booksData);
  } catch (error) {
      res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  let book = await books[req.params.isbn];
  if(book){
    res.send(book);
  }else
  return res.status(403).json({message: "Book not found"});
 });
  
function getBooksByKey(key, value){
  let booksDetail =  Object.values(books);
  return booksDetail.filter((book)=>book[key] ===  value[key]);
}
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  let authBooks = await getBooksByKey('author', req.params);
  if(authBooks.length > 0)
    res.send(authBooks);
  else
  return res.status(403).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let result = await getBooksByKey('title', req.params);
  if(result.length > 0)
    res.send(result);
  else
  return res.status(403).json({message: "Book not found"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let reviews = books[isbn]['reviews'];
  if (Object.keys(reviews).length > 0) {
    return res.status(200).json({ message: "Review added successfully", reviews });
  } else {
      return res.status(500).json({ message: "Error adding review" });
  }
});

module.exports.general = public_users;
