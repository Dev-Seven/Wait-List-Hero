<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Crypt;

function verifyAPITokenData()
{
	$header = request()->header('AuthorizationUser');

	// $enc = Crypt::encrypt('apiuser@waitlisthero.com|12345678');

	try {
		
		$authorization_cred = Crypt::decrypt($header);
		$expcred = explode('|', $authorization_cred);
 		$apiuser = $expcred[0];
 		$apipassword = $expcred[1];

	} catch (Exception $e) {
		$message = 'Invalid Authantication token';
		return InvalidResponse($message,101);
	}

	$user = \App\Models\User::where('email',$apiuser)->first();
	if($user && Hash::check($apipassword,$user->password)){
		$message = 'valid token';
		return SuccessResponse($message,200,[]);
	} else {
		$message = 'Invalid Authantication token';
		return InvalidResponse($message,101);
	}
}

function SuccessResponse($message,$status_code,$data)
{
    return response()->json(['success' => true,
		'status_code' => $status_code,
		'message' => $message,
		'data' => $data
    ]);
}

function InvalidResponse($message,$status_code)
{
    return response()->json(['success' => false,
		'status_code' => $status_code,
		'message' => $message,
		'data' => array()
    ]);
}

function checkLoginCredentials($email, $password, $role)
{
	$user = \App\Models\User::where('email',$email)->first();

    if(empty($user)){
        $message = 'User is not found.';
        return InvalidResponse($message,101);
    }

    $check_password = Hash::check($password, $user->password);

    if(!$check_password){
    	$message = 'Please enter valid cridentials.';
        return InvalidResponse($message,101);
    }

    if($user->role != $role){
        $message = 'Please login in client side.';
        return InvalidResponse($message,101);
    }

    if($user->status == 0){
        $message = 'Your account is not activated.';
        return InvalidResponse($message,101);
    }

    $token = \JWTAuth::fromUser($user);
    $user['token'] = $token;

    return $user;
}

function generateRandomString($length)
{
	$randomString = '';
	$characters = '123456789';
	$characterLengths = strlen($characters);
	for($i=0; $i<$length;$i++)
	{
		$randomString .= $characters[rand(0,$characterLengths - 1)];
	}
	return $randomString;
}

function generateRandomToken($length)
{
	$randomString = '';
	$characters = '123456789ABCDEFGHIJKLMNOPQRSTUVWZYabcdefghijklmnopqrstuvwxyz';
	$characterLengths = strlen($characters);
	for($i=0; $i<$length;$i++)
	{
		$randomString .= $characters[rand(0,$characterLengths - 1)];
	}
	return $randomString;
}

function UserRegistration($request)
{
	$otp = generateRandomString(6);

	$new_user_create = new \App\Models\User;
	$new_user_create->first_name = $request->first_name;
	$new_user_create->last_name = $request->last_name;
	$new_user_create->name = $request->first_name.' '.$request->last_name;
	$new_user_create->email = $request->email;
	$new_user_create->phone = $request->phone;
	$new_user_create->role = $request->role;
	$new_user_create->password = Hash::make($request->password);
	$new_user_create->status = 0;
	$new_user_create->otp = $otp;
	$new_user_create->save();

	$token = \JWTAuth::fromUser($new_user_create);
    $new_user_create['token'] = $token;

	return $new_user_create;
}

function checkSuperAdmin($id){
	$data = ['id' => $id];
    $response = node_response($data,'api/admin/find_by_id');

    if($response->status_code == 200){
    	$user = $response->data;
    	return $user->role;
    }
}

function resendOtp($email)
{
	$user = \App\Models\User::where('email',$email)->first();

	if(empty($user)){
		$message = 'User is not found.';
        return InvalidResponse($message,101);
	}

	$otp = generateRandomString(6);
	$user->otp = $otp;
	$user->save();

	return 'success';
}


function node_response($post_data,$url)
{
	$post_url = env('NODE_URL').'/'.$url;

	$ch = curl_init();

	if(isset($post_data['image']) && !empty($post_data['image'])){
		$cfile = new CURLFILE($post_data['image']['tmp_name'], $post_data['image']['type'], $post_data['image']['name']);
		$post_data['image'] = $cfile;
	}

	curl_setopt($ch, CURLOPT_URL,$post_url);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($post_data));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	$server_output = curl_exec($ch);
	curl_close ($ch);

	$response = json_decode($server_output);
	return $response;
}

?>
