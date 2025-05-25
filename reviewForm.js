import React, {useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './ReviewForm.css';

const ReviewForm = ({ userId})=>{
    const {id: bookId} = useParams();
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();

        axios.post('http://localhost:5009/reviews', {book_id: bookId, user_id: userId, rating, comment})
        .then(response =>alert('Review submitted successfully!'))
        .catch(error => console.error('Error submitting review:', error));
    };

    return(
        <form onSubmit={handleSubmit} className="review-form-container">
            <h3>Leave a Review</h3>
            <label>
                Rating:
                <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />
            </label>
            <br/>
            <label>
                Comment:
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} required></textarea>
            </label>
            <br/>
            <button type="submit">Submit Review</button>
        </form>
    );
};

export default ReviewForm;