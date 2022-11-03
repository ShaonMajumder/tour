import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Redirect, useParams } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import apiClient, { toursApi, tour_create_url,get_tour_url, useUpdateTourMutation } from '../services/api';
import store from "../store";
import { setPageItem } from "../reducers/tourSlice";
import { useDispatch } from "react-redux";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"


export default function EditTour(props) {
  const { refetch } = toursApi.endpoints.tours.useQuerySubscription(props.page)
  const dispatch = useDispatch();
  const [updateTour, { isLoading2 }] = useUpdateTourMutation()
  const { id } = useParams()
  const history = props.history()
  const tourItemsAll = props.tourItems
  const setTourItemsAll = props.setTourItems
  // console.log('edit id ',useParams(),props.history())
  // console.log('success edit',store.getState().tours.tourItems)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [image, setImage] = useState(null)
  const [validationError,setValidationError] = useState({})

  useEffect(()=>{
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    
    apiClient.get(`${get_tour_url}/${id}`).then(({data})=>{
      const { title, author } = data.data
      setTitle(title)
      setAuthor(author)
    }).catch(({response:{data}})=>{
      Swal.fire({
        text:data.message,
        icon:"error"
      })
    })
  }

  const changeHandler = (event) => {
		setImage(event.target.files[0]);
	};

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('_method', 'PATCH');
    formData.append('title', title)
    formData.append('description', description)
    if(image!==null){
      formData.append('image', image)
    }

    const json_data = {
      'id' : id,
      'title' : title,
      'author' : author,
    }
    updateTour(json_data).unwrap()
    .then((payload) => {
      
      Swal.fire({
        icon:"success",
        text: payload.data.message
      })
         
      // setTourItemsAll(  tourItemsAll.map((item, index) => {  if( item.id == id){ return payload.data.data }else{ return item } })  )
      props.setPage(props.page)
      // refetch()
      history.push('/')
    })
    .catch((response)=>{
      console.log('rejected', response)
      if(response.status===422){
        setValidationError(response.data.errors)
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Tour</h4>
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
                <Form onSubmit={updateProduct}>
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
                  <Row> 
                      <Col>
                        <Form.Group controlId="Author">
                            <Form.Label>Author</Form.Label>
                            <Form.Control type="text" value={author} onChange={(event)=>{
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
                        <Form.Group controlId="Name">
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
                    Update
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