const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app =express();
const PORT = 5009;

app.use(express.json());
app.use(cors());


//db connection

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "book_review"
});

db.connect(err => {
    if(err) {
        console.log("DB Error: ",err);
    } else{
        console.log("Connected to MySQL DB");
    };
});

app.get("/", (req, res)=>{
    res.send("Welcome to Book review API");
});

app.listen(PORT, ()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});

//get books

app.get("/books", (req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page -1)*limit;

    const sql = `SELECT * FROM books LIMIT ${limit} OFFSET ${offset}`;

    db.query(sql, (err, results) =>{
        if(err) {
            console.error('Error retrieving books: ', err);
            res.status(500).json({error: 'Failed to retrieve books'});
        }else{
            res.status(200).json(results);
        }
    });
});

//get book id

app.get("/books/:id", (req, res)=>{
    const bookId = req.params.id;
    const sql = "SELECT * FROM books WHERE id =?";
    db.query(sql, [bookId], (err, results) => {
        if(err){
            console.error("Error fetching Book by ID:", err);
            return res.status(500).send("Server error");
        }

        if(results.length===0){
            return res.status(404).send("Books not found");
        }

        res.json(results[0]);
    });
});


//fetch the user's id

app.get('/users/:id', (req, res)=>{
    const userId = req.params.id;

    const query = 'SELECT id, name, email, role, created_at FROM users WHERE id=?';

    db.query(query, [userId], (err, results)=> {
        if(err){
            console.error('Error retrieving user:', err);
            res.status(500).json({error:'Failed to retrieve user'});
        } else if(results.length === 0){
            res.status(404).json({message: 'User not found'});
        } else{
            res.status(200).json(results[0]);
        }
    });
});

//update user profile

app.put('/users/:id', checkAdmin, (req, res)=> {
    const bookId = req.params.id;
    const {title, author, description, genre, published_year} = req.body;

    if(!title || !author || !description || !genre || !published_year){
        return res.status(400).json({error: "All fields are required"});
    }
    const updateQuery = `UPDATE books SET title=?,
    author=?,
    description=?,
    genre=?,
    published_year=? WHERE id=?`;

    db.query(updateQuery, [title, author, description, genre, published_yeare, bookId], (err, result)=>{
        if(err){
            console.error("Error updating book:", err);
            returnres.status(500).json({error:"Server error"});
        }
        res.status(200).json({message: "Book updated successfully"});
    });
});

// GET review

app.get('/reviews', (req, res)=>{
    const {book_id}=req.query;

    let query = 'SELECT * FROM reviews';
    let params =[];
    
    if(book_id){
        query += ' WHERE book_id=?';
        params.push(book_id);
    }
    db.query(query, params, (err, results)=>{
        if(err){
            console.error('Error fetching reviews:', err);
            res.status(500).json({error: 'Failed to retrieve reviews'});
        }else{
            res.status(200).json(results);
        }
    });
});

//post reviews
app.post('/reviews', (req, res) => {
    const {book_id, user_id, rating, comment}=req.body;

    if(!book_id || !user_id || !rating || !comment){
        return res.status(400).json({error: 'All fields are required'});
    }
    const insertQuery = `INSERT INTO reviews (book_id, user_id, rating, comment) values (?, ?, ?, ?)`;

    db.query(insertQuery, [book_id, user_id, rating, comment], (err, result)=>{
        if(err){
            console.error('Error submitting review:', err);
            return res.status(500).json({error: 'Failed to submit review'});
        }
        res.status(201).json({ message: 'Review submitted successfully', reviewId: result.insertId});
    });
});

//admin check

function checkAdmin(req, res, next){
    const userId = req.headers['x-user-id'];

    if(!userId){
        return res.status(401).json({error: "User ID required in headers"});
    }
    const sql = "SELECT role FROM users WHERE id=?";
    db.query(sql, [userId], (err, results)=>{
        if(err){
            console.error("Error checking user role:", err);
            return res.status(500).json({error: "Server error"});
        }
        if(results.length === 0){
            return res.status(404).json({error: "User not found"});
        }
        const role = results[0].role;
        if(role!=='admin'){
            return res.status(403).json({error:"Access denied. Admin only."});
        }
        next();
    })
}

//admin only access
// add new book

app.post("/books", checkAdmin, (req, res) =>{
    const {title, author, description, genre, published_year}= req.body;

    if(!title || !author || !description ||!genre || !published_year){
        return res.status(400).json({error: "All fields are required"});
    }
    const sql = `INSERT INTO books (title, author, description, genre, published_ear) values (?, ?, ?, ?, ?)`;
    const values = [title, author, description, genre, published_year];

    db.query(sql, values, (err, results) => {
        if(err){
            console.error("Error adding book: ", err.stack);
            return res.status(500).json({error: "Server error"});
        }
        res.status(201).json({message: "Book added successfully", bookId: results.insertId});
    });
});

//for update book

app.put('/books/:id', checkAdmin, (req, res) =>{
    const bookId = req.params.id;
    const { title, author, description, genre, published_year}=req.body;

    const updateQuery = `UPDATE books SET 
    title = ?,
    author = ?,
    description = ?,
    genre = ?,
    publishedYear = ?
    WHERE id = ?`;
    db.query(updateQuery, [title, author, description, genre, published_year, bookId], (err, result) => {
        if(err){
            console.error('Error updating book:', err);
            res.status(500).json({ error: 'Failed to update book'});
        } else if(result.affectedRows === 0){
            res.status(404).json({message: 'Book not found'});
        } else{
            res.status(200).json({message: 'Book updated successfully'});
        }
    });
});

//for delete book

app.delete('/books/:id', checkAdmin, (req, res)=>{
    const bookId = req.params.id;

    const deleteQuery='DELETE FROM books WHERE id = ?';

    db.query(deleteQuery, [bookId], (err, result)=>{
        if(err){
            console.error('Error deleting book:', err);
            res.status(500).json({error: 'Failed to declare book'});
        } else if(result.affectedRows === 0){
            res.status(404).json({message: 'Book not found'});
        }else{
            res.status(200).json({message: 'Book deleted Successfully'});
        }
    });
});

