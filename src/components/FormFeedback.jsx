import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import { TextField, Typography, Button, ButtonGroup } from '@material-ui/core';
import { Send, Delete, Star } from '@material-ui/icons';
import { ModalContext } from './FeedbackTable';

const FormFeedback = ( {name} ) => {
  const [phone, setPhone] = useState('');
  const [feedback, setFeedback] = useState('');
  const [starValue, setStarValue] = useState(0);
  const [starHover, setStarHover] = useState(undefined);
  const [phoneError, setPhoneError] = useState(false);
  const [feedbackError, setFeedbackError] = useState(false);
  const [guestName, setGuestName] = useState(name);
  const stars = Array(5).fill(0);
  const initStars = useRef(0);
  const initPhone = useRef('');
  const initFeedback = useRef('');
  const { modal, feedbacks } = useContext(ModalContext);
  const [modalOpen, setModalOpen] = modal;
  const [hasFeedback, setHasFeedback] = feedbacks;

  const saved = localStorage.getItem(name);
  if( saved !== null ){
    const [stars, num, feed] = JSON.parse(saved);
    initStars.current = stars;
    initPhone.current = num;
    initFeedback.current = feed;
  }
  
  useEffect( () => {
    setStarValue(initStars.current);
    setPhone(initPhone.current);
    setFeedback(initFeedback.current);
  }, []);

  const handleStarClick = (value) => {
    setStarValue(value);
  }

  const handleStarHover = (value) => {
    setStarHover(value);
  }

  const handleSubmit = (e) => {
    const validate1 = /^\(?([0-9]{3})\)?[- ]?([0-9]{3})[- ]?([0-9]{4})$/;
    const validate2 = /^\+?([0-9]{2})\)?[- ]?([0-9]{4})[- ]?([0-9]{4})$/;
    e.preventDefault();
    if( phone.length > 10 || phone.length < 3){
      setPhoneError(true);
    } 
    if( feedback === ''){
      setFeedbackError(true);
    }
    if( starValue === 0 ){
      alert("Set Your Rating");
    } else {
      if( phoneError !== true || feedbackError !== true ){
        localStorage.setItem(`${name}`, JSON.stringify([starValue, phone, feedback]));
        const obj = {}
        obj[guestName] = true;
        setHasFeedback({...hasFeedback, ...obj});
        setModalOpen(false);
      }
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    setStarValue(0);
    setPhone('');
    setFeedback('');
    localStorage.removeItem(`${name}`);
    const obj = {}
    obj[guestName] = false;
    setHasFeedback({...hasFeedback, ...obj});
    setModalOpen(false);
  }

  return (
      <>
        <Typography 
          variant='h6' gutterBottom 
          color='textPrimary' 
          component='h2'>{name}
        </Typography>
        <div style={styles.containerStars}>
          {stars.map((_, index) => (
            <Star key={index}
              onClick={() => handleStarClick(index + 1)}
              onMouseOver={() => handleStarHover(index + 1)}
              onMouseLeave = { () => setStarHover(undefined) }
              color = { (starValue || starHover) > index ? 'primary' : 'disabled'}
            />
          ))}
        </div>
        <form autoComplete='off'>
          <TextField 
            type="tel"
            placeholder='+33-333-3333 or 3333333333'
            value={phone}
            style={styles.container}
            onChange={(e) => { setPhone(e.target.value); 
              if(e.target.value.length > 10 || e.target.value.length < 3){
                setPhoneError(true)} }}
            label='Phone Number' variant='outlined' 
            color='primary' fullWidth required error={phoneError} />
          <TextField 
            value={feedback}
            style={styles.container}
            onChange={(e) => { setFeedback(e.target.value) }}
            label='Feedback' variant='outlined' 
            color='primary' fullWidth required 
            multiline rows={4} error={feedbackError}/>
          <ButtonGroup fullWidth style={{marginTop: '10px'}}>
            <Button type ='submit' onClick={(e)=>handleDelete(e)} color='secondary' variant='contained' endIcon={<Delete/>}> Delete </Button>
            <Button type='submit' onClick={(e)=>{handleSubmit(e)}} color='primary' variant='contained' endIcon={<Send/>}> Submit </Button>
          </ButtonGroup>
        </form>
      </>
  )
}

const styles = {
  containerStars: {
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: '10px',
    marginBottom: '15px'
  },
  container: {
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    marginBottom: '15px',
    marginTop: '5px'
  }
}

export default FormFeedback;