import React, { useState, useEffect } from "react";
import Rating from "react-rating";
import { Card, Button,Form, Row, Col} from "react-bootstrap";
import ErrorModal from './ErrorModal';
import LoadingSpinner from './LoadingSpinner';
import { useHttpClient } from '../../hooks/useHttpClient';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';

const Ratingdoc= (props) => {
  const history = useHistory();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedRating, setLoadedRating] = useState();
    const docID=useParams().docID;
    
  //   useEffect(() => {
  //     const fetchUsers = async () => {
   
  //       try {
  //         const responseData = await sendRequest('http://localhost:5000/api/doctors/rating');
  
  
  //         setLoadedRating(responseData.doctors);
  //       } catch (err) {
  // console.log(err);
  //       }
  //     };
  //     fetchUsers();
  //   }, [sendRequest]);
  useEffect(()=> {
    const fetchPlaces = async() =>{
      try{
        const responseData = await sendRequest(
        `https://localhost:5000/api/places/users/doctorprofile/${docID}`
        );
        setLoadedRating(responseData.doctors.rating);
        console.log(responseData.doctors.rating);
        console.log("rating send");
      }
      catch(err)
      {}
    };
      fetchPlaces();
    
  }, [docID]);

    const [rating1, setRating1] = useState(0);

    const reviewChange= async () =>{ 
      var rrview = document.getElementById('xx').value;
      console.log( rrview);
      let p;
      try {
        const responseData = await sendRequest(
          `https://localhost:5000/api/users/doctor/${docID}/review`,
          'POST',
          JSON.stringify({
            review:rrview
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        p=responseData.message;
        console.log(p);
        //history
        
      }
      catch (err) {}
    }
    const ratingChange= async (rate) =>{ 
      setRating1((rate))
    
    console.log(rating1);
    let g;
        var finalrating=(loadedRating+rating1)/2;
        

        try {
            const responseData = await sendRequest(
              `https://localhost:5000/api/users/doctor/${docID}/rating`,
              'PATCH',
              JSON.stringify({
                rating:finalrating
              }),
              {
                'Content-Type': 'application/json'
              }
            );
            g=responseData.message;
            //history
            console.log(g);
            console.log("at rating");
          }
          catch (err) {}
          
          //setRating1(0);
          //history.push('/');
      };

 
    return(
       <div className="BGGradeAllergy">
      <div className="TopMarginAllergy"></div>
    
      <div className="box" id="heading">
          <h1 className="Heading"> Rate n Review</h1>{" "}
      </div>
      <Jumbotron className="container" bg-dark>
      
      <Rating
       initialRating={rating1}
       onClick={rate =>ratingChange(rate) }
     />
     <Form onSubmit={reviewChange}> 
        <Form.Group className="mb-3" >
   <Form.Label>review textarea</Form.Label>
   <Form.Control id="xx" as="textarea" rows={3} />
 </Form.Group>
       <button type="submit">Submit</button>
       </Form>
       </Jumbotron>
     </div>
    );
}

export default Ratingdoc;
