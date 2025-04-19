<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use TomatoPHP\LaravelAgora\Facades\Agora;

class AgoraController extends Controller
{
    public function getToken(Request $request)
    {
        $request->validate(['channelName' => 'required|string']);
        $token = Agora::make($request->channelName)
                      ->uId(Auth::id())
                      ->token();
        return response()->json(['token' => $token]);
    }
}
