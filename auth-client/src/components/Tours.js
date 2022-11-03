import React from 'react';
import apiClient,{tour_url} from '../services/api';
import Cookies from 'js-cookie';
import { getTourItems } from '../reducers/tourSlice';
import { useDispatch, useSelector } from "react-redux";

const Tours = (props) => {
    const dispatch = useDispatch();
    const { tourItems, isLoading } = useSelector((store) => store.tours);
    // const [tours, setTours] = React.useState([]);
    React.useEffect(() => {
        if (props.loggedIn) {
            dispatch(getTourItems());
        }
      
    }, []);
    console.log(tourItems)
    const tourList = tourItems.map((tour) => 
        <div key={tour.id}
            className="list-group-item"
        >
            <h5>{tour.title}</h5>
            <small>{tour.author}</small>
        </div>
    );
    if (props.loggedIn) {
        return (
            <div className="list-group">{tourList}</div>
        );
    }
    return (
        <div className="alert alert-warning">You are not logged in.</div>
    );
};

export default Tours;
