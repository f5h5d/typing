import axios from 'axios'
import React, { useEffect } from 'react'
import { API } from '../constants'
import { useSelector } from 'react-redux'
import { useParams } from "react-router-dom"

const EmailVerified = () => {
  const params = useParams();

  useEffect(() => {
    console.log("reached here")
    const verify = async () => {
      try {
        axios.get(`${API}/auth/${params.id}/verify/${params.token}`).then((response) => {
          console.log(response);
        })
      } 
      catch (err) {
        console.log(err);
      }
    }

    verify()
  }, [params])
  return (
    <div>YOU HAVE VERIFIED YOUR EMAIL ACCOUNT!!!!</div>
  )
}

export default EmailVerified