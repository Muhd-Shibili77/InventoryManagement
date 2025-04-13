import React from 'react';
import { Navigate } from 'react-router-dom';



const ProtectedAuthRoutes =({element}) =>{
    const token = localStorage.getItem('token')
    
    if(token){
        return <Navigate to={"/inventory"}/>
    }
    return element;
}

export default ProtectedAuthRoutes;