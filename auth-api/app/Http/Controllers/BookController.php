<?php

namespace App\Http\Controllers;

use App\Http\Components\ApiTrait;
use App\Models\Book;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BookController extends Controller
{
    use ApiTrait;

    /**
     * List Books with Pagination
     */
    public function listBooks(Request $request){        
        $this->apiSuccess();
        $this->data = [
            'books' => Book::paginate(10)//new UserResource($user)
        ];
        return response()->json(
            ...$this->apiResponseBuilder(
                $status_code = Response::HTTP_OK,
                $message     = 'Book List populated Successfully',
            )
        );
    }
    

    public function getBook(Request $request,Book $id){        
        $this->apiSuccess();
        $this->data = $id;
        
        return response()->json(
            ...$this->apiResponseBuilder(
                $status_code = Response::HTTP_OK,
                $message     = 'Got book Successfully',
            )
        );
    }





    /**
     * Adds Book
     */
    public function addBook(Request $request){
        $validator = Validator::make($request->all(),[
            'title' => ['required'],
            'author' => ['required'],
            'image' => ['image']
        ]);

        if($validator->fails()){
            $this->data = $validator->errors(); //->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_UNPROCESSABLE_ENTITY,
                    $message = 'Here is an error occured !'
                )
            );
        }

        try{
            // dd($request->post());
            // $imageName = Str::random().'.'.$request->image->getClientOriginalExtension();
            // Storage::disk('public')->putFileAs('product/image', $request->image,$imageName);
            // Product::create($request->post()+['image'=>$imageName]);

            Book::insert([
                'title' => $request->title,
                'author' => $request->author
            ]);

            $this->data = Book::orderBy('id', 'desc')->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_OK,
                    $message = 'Books added successfully !'
                )
            );
            
        }catch(Exception $e){
            $this->data = $this->getExceptionError($e); //->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_UNPROCESSABLE_ENTITY,
                    $message = 'Book is not added !'
                )
            );
        }

    }

    /**
     * Update Book
     */
    public function updateBook(Request $request, Book $id){
        // dd($request->except('_method'));
        $validator = Validator::make($request->all(),[
            'title' => ['required'],
            'author' => ['required'],
            'image' => ['image']
        ]);

        if($validator->fails()){
            $this->data = $validator->errors(); //->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_UNPROCESSABLE_ENTITY,
                    $message = 'Payload Validation is failed !'
                )
            );
        }

        try{
            $id->title = $request->title;
            $id->author = $request->author;
            $id->save();
            $this->apiSuccess();
            $this->data = $id;
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_OK,
                    $message = 'Books updated successfully !'
                )
            );
            
        }catch(Exception $e){
            $this->data = $this->getExceptionError($e); //->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_UNPROCESSABLE_ENTITY,
                    $message = 'Book was not updated !'
                )
            );
        }
    }

    /**
     * Adds Book
     */
    public function deleteBook(Book $id){
        try{
            $id->delete();
            $this->apiSuccess();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_OK,
                    $message = 'Books deleted successfully !'
                )
            );
            
        }catch(Exception $e){
            $this->data = $this->getExceptionError($e); //->first();
            return response()->json(
                ...$this->apiResponseBuilder(
                    $status_code = Response::HTTP_UNPROCESSABLE_ENTITY,
                    $message = 'Book is not deleted !'
                )
            );
        }
    }
}
