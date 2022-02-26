import React from 'react';
import { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import { Button, Table, TableHead, TableCell, TableRow, TableBody, Modal, Box } from '@material-ui/core';
import { Visibility, VisibilityOff, CheckCircle } from '@material-ui/icons';
import FormFeedback from './FormFeedback';

export const ModalContext = React.createContext();

const FeedbackTable = () => {
    const [allGuests, setAllGuests] = useState([]);
    const [veganNot, setVeganNot] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasFeedback, setHasFeedback] = useState({});
    
    const handleReset = () => {
        localStorage.clear();
        window.location.reload(false);
    }

    const modelFun = ( name ) => {
        setModalContent( name );
        setModalOpen( true );
    }

    const fetchData = async () => {
        const res = await fetch('https://gp-js-test.herokuapp.com/pizza');
        return await res.json();
    }

    const fetchDiets = async (namesToFetch) => {
        const res = await fetch(`https://gp-js-test.herokuapp.com/pizza/world-diets-book/${namesToFetch}`);
        return await res.json();
    }
    
    const go = async () => {
        const res1 = await fetchData();
        const guests = res1.party;
        const pizzaLovers = guests.filter( chel => chel.eatsPizza === true );
        const names = [];
        pizzaLovers.forEach( chel => {
            names.push(chel.name);
        })
        const namesToFetch = names.join(',');
        const diets = await fetchDiets(namesToFetch);
        const guestsDiets = {};
        const feedbacks = {};
        diets.diet.forEach( chel => {
            guestsDiets[chel.name] = chel.isVegan;
            feedbacks[chel.name] = false;
        });
        localStorage.setItem('allGuests', JSON.stringify(guests));
        localStorage.setItem('veganNot', JSON.stringify(guestsDiets));
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        setHasFeedback( feedbacks );
        setVeganNot( guestsDiets );
        setAllGuests( guests );
    }

    useEffect ( () => {
        const guests = localStorage.getItem("allGuests");
        if( guests === null ){
            go();
        } else {
            const guestList = JSON.parse( guests );
            setAllGuests( guestList );
            const dietsList = JSON.parse( localStorage.getItem("veganNot") );
            setVeganNot( dietsList );
            const feedbacks = JSON.parse( localStorage.getItem('feedbacks') );
            setHasFeedback( feedbacks );
        }
        setIsLoading(false);
    }, []);

    useEffect( () => {
        localStorage.setItem('feedbacks', JSON.stringify(hasFeedback));
    }, [hasFeedback]);

    if( isLoading ){
        return <><LinearProgress/><p>Loading...</p></>
    }

    return (
        <>
        {!isLoading && <>
        <Table stickyHeader={true} size='small' padding='checkbox'>
            <TableHead>
            <TableRow style={{height: '35px'}}>
                <TableCell variant='head' style={{fontWeight: '500', fontSize: "16px"}}> Name of the Guest </TableCell>
                <TableCell veriant='head' align='right' style={{fontWeight: '500', fontSize: "16px"}}> View Feedback </TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {allGuests.map( chel => (
            <TableRow hover={true} key={chel.name}>
                <TableCell size='small' align='left' key={chel.name} 
                style={{fontWeight: '500', color: veganNot[chel.name]===true ? 'green' : 'black'}}>
                    {hasFeedback[chel.name] === true ? <CheckCircle fontSize='small'/> : null }
                    {chel.name}
                </TableCell>
                <TableCell align='right'>
                <Button onClick={()=>modelFun(chel.name)} disabled={veganNot[chel.name] === undefined} 
                    color='inherit' variant='outlined' size='small' 
                    style={{color: 'green', fontWeight: '500'}}
                    > View 
                    { veganNot[chel.name] !== undefined ? 
                    <Visibility color='inherit' fontSize='small'/> : <VisibilityOff color='inherit' fontSize='small'/>}
                </Button>
                </TableCell>
            </TableRow>
            ))}
            </TableBody>
        </Table></>}
        <div className='modals'>
            <ModalContext.Provider value = {{modal: [modalOpen, setModalOpen], feedbacks: [hasFeedback, setHasFeedback]}}>
                <Modal open={modalOpen} onClose={()=>setModalOpen(false) } 
                    sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <Box sx={{display:'flex', flexDirection: 'column',
                        alignItems:'center', justifyContent:'center', 
                        width:'300px', height:'400px', backgroundColor:'white', 
                        margin:'auto', marginTop:'50px', marginBottom: '50px', padding: '20px'}}>
                        <FormFeedback name = {modalContent}></FormFeedback>
                    </Box>
                </Modal>
            </ModalContext.Provider>
        </div>
        <Button onClick = {() => handleReset()}
            style={{marginTop: '10px', width: '70px'}} size='small' 
            color='primary' variant='contained'> Reset </Button>
        </>
    )
}

export default FeedbackTable;