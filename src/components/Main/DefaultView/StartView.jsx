import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../App.css'

let Start=(props)=>{
  let navigate=useNavigate();
  setTimeout(()=>{
    navigate('/plained')
  },2500)
    return (
        <div className='app-container'>
          <span className='app-text'> Добро пожаловать!</span>
        </div>
    );
}


export default Start