import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import "../../css/Allergy.css";
import Jumbotron from 'react-bootstrap/Jumbotron';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import {AuthContext} from '../../shared/util/AuthContext';
import { useParams } from "react-router-dom";

const DenyAppointment = () => {
  //const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const docID=useParams().docID;
  const userID=useParams().userID;
  const cancellation= async (props) =>{
     

    try {
        await sendRequest(
            'https://localhost:5000/api/users/cancelanappointment',
            'POST', 
            JSON.stringify({
              
               docID: docID,
               userID:userID,
            }),
     { 'Content-Type': 'application/json' }
     );
     history.push('/');
  }catch(err){}
  };
  const denycancellation= props=>{
    history.push('/');

  };



return (
  <div className="BGGradeAllergy">
  <div className="TopMarginAllergy"></div>

  <div className="box" id="heading">
      <h1 className="Heading"> Appointment Decilination</h1>{" "}
  </div>
  <Jumbotron className="container" bg-dark>
  <h2 className="Heading"> Are You Sure</h2>{" "}
  <Button 
  variant="danger"
  className="DoctorListButtonDoctor"
  onClick={cancellation}>
      YES
      </Button>{" "} 
  <Button
  variant="success"
  className="DoctorListButtonDoctor"
  onClick={denycancellation}>
      NO
    </Button>
  </Jumbotron>
</div>
);
};

export default DenyAppointment;