import React from 'react';
import style from '../../styles/Navigation/nav.module.scss'
import { NavLink ,useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { setListName } from '../../reducers/nav-reducer';
import { useDispatch, useSelector } from 'react-redux';






let NavBar=React.memo((props)=>{
    let navigate=useNavigate();
    let dispatch=useDispatch();
    let modalWindow=document.querySelector('#modal');
    let modalCover=document.querySelector('#cover');
    let modalInput=document.querySelector('#modal-input');

    let changeListName=()=>{
        modalWindow.hidden=false;
        modalCover.hidden=false;
    };
    
    let closeModal=(e)=>{
        e.preventDefault();
        modalInput.value='';
        modalWindow.hidden=true;
        modalCover.hidden=true;
    };

    let addNewList=(e)=>{
        let name= modalInput.value;
        if(name!==(null || '')){
            let path=`/${name}`
            navigate(path)
            dispatch(setListName(name));
            modalInput.value='';
            
        }else if(name===null ){
            navigate('/plained')
            modalInput.value='';
        }else if(name===''){
            navigate('/plained')
        };
        modalWindow.hidden=true;
        modalCover.hidden=true;
    }

    let createNewList=()=>{
        changeListName();
    };

    let listName=useSelector(state=>state.navReducer.newLists).map((item,i)=>{
        if(i>0){
            let path=`/${item.list}`
            return <div key={Math.random()}><div><NavLink to={path} className={style.nav_links}>{item.list}</NavLink></div></div>
        }
    });//получение нового листа и создание его в навбаре
   


    return (
       
        <div className={style.mainScreen}>
           <div  className={style.modal} hidden id='cover'></div>
           <div className={style.items}>
                <div className={style.item}>
                    <NavLink to='/myday' className={style.nav_links}>Мой день</NavLink>
                </div>
                <div className={style.item}>
                    <NavLink to='/plained' className={style.nav_links}>Запланировано</NavLink>
                </div>
                {listName}
           </div>
   
            <div className={style.add_btn_menu}>
                <div>
                    <div className={style.create_btn_nav}>
                        <button onClick={createNewList} className={style.btn_nav}>
                            <span>Создать лист</span>
                            <svg viewBox="-5 -5 110 110" preserveAspectRatio="none" aria-hidden="true">
                                <path d="M0,0 C0,0 100,0 100,0 C100,0 100,100 100,100 C100,100 0,100 0,100 C0,100 0,0 0,0"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className={style.loginbox} hidden id='modal'>
                <h2>Добавление списка</h2>
                <div className={style.userbox}>
                <input type="text" name="" required="" id='modal-input'/>
                <label>Название</label>
                </div>
                <a onClick={addNewList}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                    ОК
                </a>
                <a href="" className={style.second_btn} onClick={closeModal}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                    ОТМЕНА
                </a>
            </div>
            
         
        </div>
    );
})


export default NavBar