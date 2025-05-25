import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import './BookList.css';

const BookList = () =>{
    const [books, setBooks]= useState([]);
    useEffect(()=>{
        axios.get('http://localhost:5009/books')
        .then(response=> setBooks(response.data))
        .catch(error => console.error('Error fetching books:', error));
    }, []);
    const navigate = useNavigate();

    return(
        <div className="book-list-container">
            <h2>Books</h2>
            <ul>
                {books.map(book =>(
                    <li key={book.id} className="book-item">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">{book.author}</p>
                        <p className="book-description">{book.description}</p>
                        <button className="view-button" onClick={() => navigate(`/books/${book.id}`)}>View Details</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;