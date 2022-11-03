import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Swal from 'sweetalert2';
import { Redirect, useHistory } from 'react-router-dom';
import apiClient, { booksApi, book_create_url, useAddBookMutation } from '../services/api';
import store from "../store";


const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

export default function CreateBook(props) {
  const { refetch } = booksApi.endpoints.books.useQuerySubscription(props.page)
  const [addBook, { isLoading2 }] = useAddBookMutation()
  // const page = props.page;
  // const setPage = props.setPage;
  const history = props.history()

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [image, setImage] = useState()
  const [validationError,setValidationError] = useState({})
  
  const changeHandler = (event) => {
		setImage(event.target.files[0]);
	};

  const createProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('title', title)
    formData.append('author', author)
    formData.append('description', description)
    formData.append('amount', amount)
    formData.append('image', image)

    const json_data = {
      'title' : title,
      'author' : author
    }

    await addBook(json_data).unwrap()
    .then((payload) => {
      console.log('success creation',payload)
      Swal.fire({
        icon:"success",
        text: payload.message
      })
      
      // refetch()
      let last_page = store.getState().books.last_page
      props.setPage(last_page)
      
      history.push('/')
    })
    .catch((error) => console.error('rejected', error))
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Book</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>   
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={createProduct}>
                  <Row> 
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(event)=>{
                              setTitle(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Author">
                            <Form.Label>Author</Form.Label>
                            <Form.Control as="textarea" rows={3} value={author} onChange={(event)=>{
                              setAuthor(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(event)=>{
                              setDescription(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row> 
                      <Col>
                        <Form.Group controlId="Amount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text" value={amount} onChange={(event)=>{
                              setAmount(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}