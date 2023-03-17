import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { deleteListCreator, setFlagForSelectedDateForAdd, setTasks } from '../../../reducers/nav-reducer';
import { useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import TaskForAdd from './TaskForAdd';




const NewList=React.memo((props)=>{


    let navigation=useNavigate();
    let dispatch=useDispatch();
    let data=useSelector(store=>store.navReducer.date)?.filter(item=>(item.list===props.id));
    let flag=useSelector(store=>store.navReducer.flagForSelectedDateFordd)?.filter(item=>(item.list===props.id))[0]?.str;
    let currentTasks;
    let viewTasks=(item)=>{
        return currentTasks=item.tasks.map((items,i)=><TaskForAdd task={items} nameList={item.list} key={Math.random()} check={false} line={false} flag={flag ?? ''}></TaskForAdd>)
    }
    useSelector(store=>store.navReducer.newLists).forEach((item,i,array)=>{
        if(item.list===props.id){
            viewTasks(item)
        }
    });

    let completedTasks;
    let viewCompletedTasks=(item)=>{
        return completedTasks=item.tasks.map(elem=><TaskForAdd task={elem.current} nameList={item.list} key={Math.random()} check={true} line={true} flag={''}></TaskForAdd>)
    }

    useSelector(state=>state.navReducer.completedTasks.forEach((item,i,arr)=>{
        if(item.list===props.id){
          viewCompletedTasks(item)
        }
    }));
    
    let createNewTask=()=>{
        let taskName=document.getElementById('inputValueNewList').value;
        if(taskName!==''){
            dispatch(setTasks(props.id,taskName));
            document.getElementById('inputValueNewList').value='';
        }else{
            alert('Введите название задачи')
        }
        
    }

    let deleteList=()=>{
        dispatch(deleteListCreator(props.id));
        alert(`Список "${props.id}" успешно удален`)
        navigation('/plained');
    };
  
    let selectDataForAdd=(e)=>{
        let dropBtn=document.getElementById('dropdown-basic-button');
        dropBtn.innerHTML=e.substr(1);
        if(e==="#Сегодня"){
            dispatch(setFlagForSelectedDateForAdd(props.id,"#Сегодня"))
            data.filter(item=>item.date.split(',')[0]===new Date().toLocaleDateString());
        }else if(e==="#Завтра"){
            dispatch(setFlagForSelectedDateForAdd(props.id,"#Завтра"))
        }else{
            dispatch(setFlagForSelectedDateForAdd(props.id,''));
        };
    };

    let NewKeyForAdd= (e)=>{
        if(e.keyCode === 13){
            createNewTask();
            
        } 
    };//создание задачи по нажатии Enter
    
  
    return (
        <div className='keepLeftForAdd'>
             <div className={styles.selectDataTask}>
                <DropdownButton id="dropdown-basic-button" title="Выбрать период" onSelect={selectDataForAdd}>
                    <Dropdown.Item href="#Сегодня">Сегодня</Dropdown.Item>
                    <Dropdown.Item href="#Завтра">Завтра</Dropdown.Item>
                    <Dropdown.Item href="#Весь">Весь</Dropdown.Item>
                </DropdownButton>
            </div>
            <div>{currentTasks}</div>
            <div>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Завершенные задачи</Accordion.Header>
                        <Accordion.Body id='completedTasksInAddList'>
                            {completedTasks}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
            
           <div className={styles.createTask}>
                <InputGroup className='abc' >
                        <Form.Control
                            placeholder="Название задачи"
                            aria-label="Название задачи"
                            aria-describedby="basic-addon2"
                            id='inputValueNewList'
                            onKeyDown={NewKeyForAdd}
                        />
                        <Button variant="outline-secondary" id="button-addon2" onClick={createNewTask}>
                            Создать задачу
                        </Button>
                        <Button variant="outline-danger" onClick={deleteList}>Удалить список</Button>{' '}
                    </InputGroup>
            </div>
            
        </div>
    );
})


export default NewList