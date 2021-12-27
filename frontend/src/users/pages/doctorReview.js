import React, {useEffect,useContext, useState} from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/useHttpClient';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ReviewList from './Reviewlist';
import { AuthContext } from '../../shared/util/AuthContext';

const DoctorReview = props =>{
  const auth = useContext(AuthContext);
const { isLoading, error, sendRequest, clearError } = useHttpClient();

const [ loadedpres, setLoadedPres] = useState();
const userId= auth.userId;

useEffect(()=> {
  const fetchPlaces = async() =>{
    try{
      const responseData = await sendRequest(
      `https://localhost:5000/api/places/users/review/${props.doc}`
      );
      setLoadedPres(responseData.Review);
    }
    catch(err)
    {}
  };
    fetchPlaces();
  
}, [sendRequest, userId]);



return (
    <React.Fragment>
      
     {isLoading && (<div className="center">  <LoadingSpinner  /></div>)}
  {!isLoading &&loadedpres && <ReviewList items={loadedpres}  />}
  </React.Fragment>
  );
  

};
export default DoctorReview;