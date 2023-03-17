import React from 'react';
import { Route, Routes} from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewList from '../Main/NewLists/NewList';

const Routing=React.memo((props)=>{
    let listName=useSelector(state=>state.navReducer.newLists).map((item,i)=>{
        if(i>0){
            let path=`/${item.list}`
            return <Route exact path={path} key={Math.random()} element={<NewList id={item.list}></NewList>}></Route>
        }
    });

    return (
        <Routes>{listName}</Routes>
    );
});

export default Routing