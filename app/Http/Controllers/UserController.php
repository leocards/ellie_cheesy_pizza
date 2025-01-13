<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Users', [
            "users" => User::paginate($this->paginate)
        ]);
    }

    public function indexJson(Request $request)
    {
        $search = $request->query('search');

        return response()->json(
            User::when()
                ->when($search, function ($query) use ($search) {
                    $query->where('first_name', 'LIKE', "%{$search}%")
                        ->orWhere('last_name', 'LIKE', "%{$search}%")
                        ->orWhere('middle_name', 'LIKE', "%{$search}%");
                })
                ->paginate($this->paginate)
        );
    }

    public function create(User $user = null)
    {
        if($user)
            $user->username = $user->masked_username;

        return Inertia::render('Users/CreateUser', [
            "user" => $user
        ]);
    }

    public function store(UserRequest $request, User $user = null)
    {
        try {
            $avatar = null;

            if($request->avatar) {
                $path = $request->file('avatar')->store('avatar');
                $avatar = '/storage/'.$path;
            } else if($user) {
                $avatar = $user->avatar;
            }

            DB::transaction(function () use ($request, $user, $avatar) {
                User::updateOrCreate(['id' => $user?->id], [
                    "first_name" => $request->first_name,
                    "last_name" => $request->last_name,
                    "middle_name" => $request->middle_name,
                    "birthdate" => Carbon::parse($request->birthdate)->format('Y-m-d'),
                    "sex" => $request->sex,
                    "address" => $request->address,
                    "mobile" => $request->mobile,
                    "email" => $request->email,
                    "role" => $request->role,
                    "username" => $user ? $user->username : $request->username,
                    "password" => $user ? $user->password : $request->password,
                    "avatar" => $avatar
                ]);
            });

            if($user){
                $message = $request->first_name." ".$request->last_name." has been updated.";
                $title = "Updated user!";
            } else {
                $message = $request->first_name." ".$request->last_name." has been added.";
                $title = "New user!";
            }

            return redirect()->route('users')->with(['message' => $message, 'title' => $title, 'status' => 'success']);
        } catch (\Throwable $th) {

            return back()->with(['message' => (!$user ? $th->getMessage().'Failed to create new user':'Failed to update user'), 'title' => 'Failed attempt', 'status' => 'error']);
        }
    }
}
