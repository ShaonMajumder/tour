import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../resources/app.css';
import Swal from 'sweetalert2';
import Table from 'react-bootstrap/Table';
import PaginationCustom from './Pagination';
import { useBooksQuery } from '../services/api';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import { useDeleteBookMutation} from '../services/api';
import { useHistory } from 'react-router-dom';
import store from '../store'; //important without it listner in extra reducer doesn't work
import { GoTrashcan } from 'react-icons/go';
import { FaEdit } from 'react-icons/fa'

const BookList = (props) => {
    console.log('props.loggedIn ',props.loggedIn )
    const page = props.page;
    const setPage = props.setPage;
    const bookItemsAll = props.bookItems;
    const setBookItemsAll = props.setBookItems;
    console.log(props)
    const history = useHistory();
    const [deleteBook, { isLoading3 }] = useDeleteBookMutation({
        fixedCacheKey: 'shared-update-post',
      })
    const [validationError,setValidationError] = useState({})
   
    

    const deleteProduct = async (id) => {
        
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            return result.isConfirmed
        });

        if(!isConfirm){
            return;
        }



        deleteBook(id)
            .unwrap()
            .then(( response ) => {
                
                // setBookItemsAll(bookItemsAll.filter(book => book.id !== id))
                Swal.fire({
                    icon:"success",
                    text: response.data.message
                })
                history.push('/')
            })
            .catch((error) => {
                let errors = Object.entries(error.data.errors).map(([key, value])=>(
                    value
                ))
                Swal.fire({
                    text: errors,
                    icon:"error"
                })
            })
  
        // }).catch(({response})=>{
        //   if(response.status===422){
        //     setValidationError(response.data.errors)
        //   }
        // })
         
    }
    
    //run createApi query, set data from reducer listner, then access data into component from store
    const { data: bookItems, isLoading, isSuccess, isError }  = useBooksQuery(page, {skip: !props.loggedIn})
    console.log(' index',bookItems)
    
    React.useEffect(() => {
        if (bookItems){
            setBookItemsAll(bookItems.data.books.data)
        }
      },[bookItems])
    
    if (props.loggedIn && bookItems) {
        let data = bookItems.data.books
        var data_prop = [data.current_page, data.last_page, isSuccess, setPage];
        const bookList =bookItemsAll.map(({ id, title, author }) => 
            <tr key={id}>
                <td>{id}</td>
                <td>{title}</td>
                <td>{author}</td>
                <td>
                    <GoTrashcan className='table-icons' onClick={()=>deleteProduct(id)} />
                    <FaEdit className='table-icons' onClick={ ()=> history.push(`/books/update/${id}`) } />
                </td>
            </tr>
        );
        
        return (
            <div className="list-group">
                <Link className='btn btn-primary mb-2 float-end primary-background' to={"/books/create"}>
                    Create Book
                </Link>
                <Table responsive="sm" striped bordered hover >
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {bookList}
                    </tbody>
                </Table>

            
                <PaginationCustom props={data_prop} ></PaginationCustom>
            </div>
        );
    }
    return (
        <div className="alert alert-warning">You are not logged in.</div>
    );
};

export default BookList;
