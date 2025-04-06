import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import { AuthProvider } from './contexts/AuthContext';
//import './output.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
      <h1 className="text-4xl font-extrabold text-center mt-12 mb-8 text-gray-900">
        {/*OpenIDConnect & OAuth 2.0 Authorization Code Flow with PKCE (oidc-client-ts)*/}
        playling M3u Client
      </h1>
      <div className="container">
        <div className="box box-50">
          <VideoPlayer />
        </div>
        {/*
        <div className="box box-30">
          <APIManager />
        </div>
        <div className="box box-30">
          <QueueManager />
        </div>
        */}
      </div>
    </AuthProvider>
  );
};

export default App;
