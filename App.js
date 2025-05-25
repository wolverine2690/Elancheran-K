import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import BookList from './components/books/booksList';
import BookDetail from './components/books/bookDetail';
import ReviewList from './components/reviews/reviewList';
import ReviewForm from './components/reviews/reviewForm';
import BookPage from './components/books/BookPage';

const App = () =>{
    return (
        <Router>
            <div>
                <h1>Book Review Platform</h1>
                <Routes>
                    <Route path="/" element={<BookList/>}/>
                    <Route path = "/books/:id" element={<BookDetail/>}/>
                    <Route path = "/books/:id/review" element = {<ReviewForm/>}/>
                    <Route path="/books/:id/reviews" element={<ReviewList/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;