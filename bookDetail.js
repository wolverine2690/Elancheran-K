import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './BookDetail.css';
import ReviewForm from '../reviews/reviewForm';
import ReviewList from '../reviews/reviewList';


const BookDetail =() => {
    const {id}=useParams();
    const [book, setbook]=useState(null);
    useEffect(()=>{
        axios.get(`http://localhost:5009/books/${id}`)
        .then(response => {
            console.log("Fetched Book: ", response.data);
            setbook(response.data);
        })
            .catch(error =>
            console.error('Error fetching book:', error));
    }, [id]);
    return (
        <div className="book-detail">
            {book ?(
                <>
                    <div className="book-details">
                        <h2>{book.title}</h2>
                        <p>{book.author}</p>
                        <p>{book.description}</p>
                        <p>Published: {book.published_year || 'Not Available'}</p>
                    </div>
                    <div className="review-section">
                        <h3>Leave a Review</h3>
                        <ReviewForm userId={1} />
                        <ReviewList bookId={id}/> 
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default BookDetail;