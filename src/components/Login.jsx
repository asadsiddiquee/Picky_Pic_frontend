import React from 'react';
import { useEffect } from 'react';
import GoogleLogin from '@leecheuk/react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logoP.png';
import { gapi } from 'gapi-script';
import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  // fixed google login issue with gapi package
  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE_API_TOKEN });
    });
  }, []);
  //  response for login success or failure stored in storage. destructed and created variable doc for sanity which will create user
  const responseGoogle = (response) => {
    localStorage.setItem('user', JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full ">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            {/* google login package provided the client id with console cloud google. the response is created and passed depending on success or failure - check above - more on package doc*/}
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none md:text-xl hover:animate-pulse"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
