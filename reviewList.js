import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import './ReviewList.css';

const ReviewList = () => {
    const{id: bookId} = useParams();
    const [review, setReviews] = useState([]);

    useEffect(()=>{
        axios.get(`http://localhost:5009/reviews?book_id=${bookId}`)
        .then(response => setReviews(response.data))
        .catch((error) => console.error('Error fetching reviews:', error));
    }, [bookId]);

    return(
        <div className="review-section">
            <h3>Reviews</h3>
            <ul className="review-list">
                {review.map(r=>(
                    <li key={r.id} className="review-item">
                        <p>{r.comment}</p>
                        <p>Rating: {r.rating}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewList;