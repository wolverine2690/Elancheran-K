import React, {useEffect, useState} from 'react';
import axios from 'axios';

const BookPage = () =>{
    const [books, setBooks]=useState([]);
    const[role, setRole]= useState('user');
    const [newBook, setNewBook] = useState({title: '', author: '', description:'', genre:'', published_year:''});
    const [editingBookId, setEditingBookId] = useState(null);
    const [editData, setEditData]= useState({title:'', author:'', description:'', genre:'', published_year:''});
        
    
    const fetchBooks =async () =>{
        try{
            const res = await axios.get('http://localhost:5009/books');
            setBooks(res.data);
        }catch(err){
            console.error('Error fetching books:', err);
        }
    };
    const deleteBook = async(id)=>{
        try{
            await axios.delete(`http://localhost:5009/books/${id}`, {
                headers: {'x-role':role}
            });
            fetchBooks();
        }catch(err){
            alert('Only admin can delete a book!');
        }
    };
    const handleAddBook = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://localhost:5009/books', newBook, {
                headers: {'x-role':role}
            });
            setNewBook({title:'', author:'', description:'', genre:'', published_year:''});
            fetchBooks();
        }catch(err){
            alert('Only admin can add a book!');
        }
    };
    const startEdit = (book)=>{
        setEditingBookId(book.id);
        setEditData({...book});
    };
    const handleUpdateBook = async (e)=>{
        e.preventDefault();
        try{
            await axios.put(`http://localhost:5009/books/${editingBookId}`, editData,{
                headers:{'x-role':role}
            });
            setEditingBookId(null);
            fetchBooks();
        }catch(err){
            alert('only admin can update a book!');
        }
    };
    useEffect(()=>{
        fetchBooks();
    }, []);

    
    

    return (
        <div>
            <h1>Book List</h1>
            <div style={{marginBottom: '1rem'}}>
                <label>Current Role: </label>
                <select value={role} onChange={(e)=> setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            {role === 'admin' &&(
                <form onSubmit={handleAddBook} style={{marginBottom: '2rem'}}>
                    <h3>Add New Book</h3>
                    <input type="text" placeholder="Title" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} required/>
                    <input type="text" placeholder="Author" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} required/>
                    <input type="text" placeholder ="Description" value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} required/>
                    <input type="text" placeholder = "Genre" value={newBook.genre} onChange = {(e)=>setNewBook({...newBook, genre: e.target.value})} required/>
                    <input type="number" placeholder="Published Year" value={newBook.published_year} onChange={(e)=> setNewBook({...newBook, published_year:e.target.value})} required/>
                    <button type="submit">Add Book</button>
                </form>
            )}

            <ul>
                {books.map(book=>(
                    <li key={book.id}>
                        {editingBookId == book.id ?(
                            <form onSubmit={handleUpdateBook}>
                                <input type="text" value={editData.title} onChange={(e)=> setEditData({...editData, title: e.target.value})}/>
                                <input type="text" value={editData.author} onChange={(e)=> setEditData({...editData, author: e.target.value})}/>
                                <button type="submit">Save</button>
                                <button type="button" onClick={()=> setEditingBookId(null)}>Cancel</button>
                            </form>
                        ):(
                            <>
                            <strong>{book.title}</strong> by {book.author}
                            {role === 'admin' && (
                                <>
                                    <button onClick={()=> deleteBook(book.id)} style={{marginLeft: '1rem'}}>Delete</button>
                                    <button onClick={()=> startEdit(book)} style={{marginLeft: '0.5rem'}}>Edit</button>
                                </>
                                )}
                            </>
                        
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookPage;