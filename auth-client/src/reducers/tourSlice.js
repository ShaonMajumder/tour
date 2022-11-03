import { createSlice, createAsyncThunk, isAllOf, current } from "@reduxjs/toolkit";
import apiClient,{toursApi, tour_url} from "../services/api";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import {useHistory} from 'react-router-dom';
import store from "../store";
import { useToursQuery } from "../services/api";
const initialState = {
  tourItems: [],
  total: 0,
  per_page : 0,
  current_page : 1,
  last_page : 0,
  isLoggedIn: false,
  isLoading: true,
};


//Fetch
// export const getTourItems = createAsyncThunk("tour/getTourItems", () => {
//   return fetch(url)
//     .then((resp) => resp.json())
//     .catch((err) => console.log(err));
// });

//Axios
// ThunkAPI can get the state of the APP and access andinvoke functions on the state
export const getTourItems = createAsyncThunk(
  "tour/getTourItems",
  async (name, thunkAPI) => {
    try {
      apiClient.interceptors.request.use(config => {
        config.headers['Authorization'] = `Bearer ${Cookies.get('access_token')}`;
        return config;
      });
      const resp = await apiClient.get(tour_url);
      return resp.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

const tourSlice = createSlice({
  name: "tour",
  initialState,
  reducers: {
    clearTourList: (state) => {
      state.tourItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.tourItems = state.tourItems.filter((item) => item.id !== itemId);
    },
    setPageItem: (state,action) => {
      // state.current_page = action.payload
      return {
        ...state,
        current_page : action.payload
      }
      // console.log(useToursQuery(action.payload))
    },
    setLoggedIn: (state) => {
      state.isLoggedIn = true
      sessionStorage.setItem('loggedIn',true)
    },
    setLoggedOut: (state) => {
      state.isLoggedIn = false
      sessionStorage.setItem('loggedIn',false)
    }
   
  },
  extraReducers: (builder) => {
    
    builder
    .addMatcher(
      isAllOf(toursApi.endpoints.tours.matchFulfilled),
      (state, payload ) => {
        console.log('createApi -> extraReducers -> Tours Index Listener, state and payload',state,payload)
        //setting responsed data to store by api endpoints rtk-query listener
        return {
          ...state,
          tourItems : payload.payload.data.tours.data,
          total : payload.payload.data.tours.total,
          per_page : payload.payload.data.tours.per_page,
          current_page : payload.payload.data.tours.current_page,
          last_page : payload.payload.data.tours.last_page
        }
      }
    )
    .addMatcher(
      isAllOf(toursApi.endpoints.addTour.matchFulfilled),
      (state, payload ) => {
        const { tourItems, total } = current(state)
        // return {
        //   tourItems: tourItems.push(),
        //   total: total + 1
        // }
      }
    )
    .addMatcher(
      isAllOf(toursApi.endpoints.updateTour.matchFulfilled),
      (state, payload ) => {
        // const { tourItems, total } = current(state)
        // const id = payload.payload.originalArg.id
        // const payload_data = payload.payload.data.data
        
        // return {
        //   ...state,
        //   tourItems : tourItems.map((item, index) => {
        //     if( item.id == id){
        //       return payload_data
        //     }else{
        //       return item
        //     }
        //   })
        // }
        
      }
    )
    .addMatcher(
      isAllOf(toursApi.endpoints.deleteTour.matchFulfilled),
      (state, payload ) => {
        // let tourId = payload.payload.originalArg
        // console.log('Delete Listner',payload.payload.data)
        // const { tourItems, total } = current(state)
        // return {
        //   tourItems: tourItems.filter(tour => tour.id !== tourId),
        //   total: total - 1
        // }
      }
    )
    .addMatcher(
      isAllOf(toursApi.endpoints.deleteTour.matchRejected),
      (state, payload ) => {
        
      }
    )
  },
  // {
  //   [getTourItems.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getTourItems.fulfilled]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false;
  //     state.tourItems = action.payload.data.tours.data
  //   },
  //   [getTourItems.rejected]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false;
  //   },
  // },
});





//console.log(tourSlice);
export const { clearTourList, nextPage,removeItem, setLoggedIn, setLoggedOut, setPageItem } = tourSlice.actions;

export default tourSlice.reducer;
