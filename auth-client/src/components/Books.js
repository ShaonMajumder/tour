import React from 'react';
import apiClient,{book_url} from '../services/api';
import Cookies from 'js-cookie';
import { getBookItems } from '../reducers/bookSlice';
import { useDispatch, useSelector } from "react-redux";

const Books = (props) => {
    const dispatch = useDispatch();
    const { bookItems, isLoading } = useSelector((store) => store.books);
    // const [books, setBooks] = React.useState([]);
    React.useEffect(() => {
        if (props.loggedIn) {
            dispatch(getBookItems());
        }
      
    }, []);
    console.log(bookItems)
    const bookList = bookItems.map((book) => 
        <div key={book.id}
            className="list-group-item"
        >
            <h5>{book.title}</h5>
            <small>{book.author}</small>
        </div>
    );
    if (props.loggedIn) {
        return (
            <div className="list-group">{bookList}</div>
        );
    }
    return (
        <div className="alert alert-warning">You are not logged in.</div>
    );
};

export default Books;
