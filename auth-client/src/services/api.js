import axios from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";

export const api_url = process.env.REACT_APP_API_URL || "http://localhost:8000"
export const client_url = process.env.REACT_APP_CLIENT_URL || "http://localhost:3000"
export const login_url = process.env.REACT_APP_LOGIN_URL || "api/login"
export const logout_url = process.env.REACT_APP_LOGOUT_URL || "api/logout"
export const csrf_token_url = process.env.REACT_APP_CSRF_TOKEN_URL || "/sanctum/csrf-cookie"
export const book_url = process.env.REACT_APP_BOOK_URL || "/api/books"
export const get_book_url = process.env.REACT_APP_BOOK_GET_URL || "/api/books"
export const book_create_url = process.env.REACT_APP_BOOK_CREATE_URL || "/api/books/add"
export const book_delete_url = process.env.REACT_APP_BOOK_DELETE_URL || "/api/books/delete"

function providesList(resultsWithIds, tagType) {
    return resultsWithIds
      ? [
          { type: tagType, id: 'LIST' },
          ...resultsWithIds.data.books.data.map(({ id }) => ({ type: tagType, id })),
        ]
      : [{ type: tagType, id: 'LIST' }]
}

// Define a service using a base URL and expected endpoints
export const booksApi = createApi({
    reducerPath: "booksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${api_url}/api`,
        prepareHeaders: (headers, { getState }) => {
            // const isLoggedIn = getState().books.isLoggedIn
            const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true' || false
            headers.set('Access-Control-Allow-Origin', client_url)
            headers.set('Content-Type', 'application/json')
            headers.set('Accept', 'application/json')
            headers.set('Access-Control-Allow-Credentials', 'true')

            // test result to turn on providedTags caching
            headers.set('Cache-Control', 'no-cache');
            headers.set('Pragma', 'no-cache');
            headers.set('Expires', '0');
            // test result to turn on providedTags caching
            
            if (isLoggedIn) {
                headers.set('Authorization', `Bearer ${Cookies.get('access_token')}`)
            }
            return headers
        }
    }),
    tagTypes: ['Book', 'User'],
    endpoints: (builder) => ({
        books: builder.query({
            query: (page = 1) => {
                // console.log("OK");
                return `/books?page=${page}`;
            },
            providesTags: (result) => providesList(result, 'Book'),
            // providesTags: ['Book'],
            // providesTags: (result, error, page) => 
            //     result
            //     ? [
            //         // Provides a tag for each post in the current page,
            //         // as well as the 'PARTIAL-LIST' tag.
            //         ...result.data.books.data.map(({ id }) => ({ type: 'Book', id })),
            //         { type: 'Book', id: 'PARTIAL-LIST' },
            //         ]
            //     : [{ type: 'Book', id: 'PARTIAL-LIST' }],


        }),
        addBook: builder.mutation({
            query: (book) => ({
                url : '/books/add',
                method: "POST",
                body: book
            }),
            transformResponse: (response, meta, arg) => response,
            
            // invalidatesTags: (result, error, id) => [
            //     { type: 'Book', id },
            //     { type: 'Book', id: 'LIST' },
            //   ],
            //   invalidatesTags: [{ type: 'Book', id: 'LIST' },10],
            invalidatesTags: ['Book'], // after creation invalidatesTags, refetch to first page,try sending to last 
        }),
        updateBook: builder.mutation({
            query: (rest ) => ({
                url : `books/update/${rest.id}`,
                method : 'PUT',
                body : rest
            }),
            // transformResponse: (response, meta, arg) => response,
            transformResponse: (response, meta, arg) => {
                // console.log('deleteBook => transformResponse')
                return {
                    originalArg: arg,
                    data: response,
                }
            },
            invalidatesTags: (result, error, arg) => [{ type: 'Book', id: arg.id }], // done
        }),
        deleteBook: builder.mutation({
            query: (id) => ({
                url : `books/delete/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Book', id },
                { type: 'Book', id: 'PARTIAL-LIST' },
              ], // done
        
            transformResponse: (response, meta, arg) => {
                // console.log('deleteBook => transformResponse')
                return {
                    originalArg: arg,
                    data: response,
                }
            },
            async onQueryStarted(
                arg,
                { dispatch, getState, queryFulfilled, requestId, extra, getCacheEntry }
            ) {
                
                // console.log('getState onQueryStarted',getState())
                // console.log('deleteBook => onQueryStarted, arg',arg)
                queryFulfilled.then(()=>{
                // console.log('deleteBook => onQueryStarted getState()',requestId,getState())
                
                })
            },
        })
    })
});

export const {
    endpoints,
    reducerPath, 
    reducer, 
    middleware,
    
    useBooksQuery,
    useAddBookMutation,
    useDeleteBookMutation,
    useUpdateBookMutation
} = booksApi;



// IF axios.create not used, we set default config for axio, axios.defaults.withCredentials = true
var headers;
const isLoggedIn2 = sessionStorage.getItem('loggedIn') === 'true' || false
if(isLoggedIn2){
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": 'true',
        "Access-Control-Allow-Origin" : client_url,
        "Authorization" : `Bearer ${Cookies.get('access_token')}`
    };
} else{
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": 'true',
        "Access-Control-Allow-Origin" : client_url,
    };
}

const apiClient = axios.create({
    headers: headers,
    baseURL: api_url,
    withCredentials: true,
})

export default apiClient