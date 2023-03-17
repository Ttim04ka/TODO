import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import styles from '../../../styles/Main/main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { moveIntoCompletedTasks, moveToActiveTasksAgainInAddingList, setWindowforAdd } from '../../../reducers/nav-reducer';
import { useEffect } from 'react';
import AppearWindowForAdd from './AppearWindowForAdd';


const TaskForAdd=React.memo((props)=>{
    let dispatch=useDispatch();
    
    let showForAdd=useSelector(store=>store.navReducer.setWindow)?.filter(item=>(item.list===props.nameList && item.task===props.task))[0];
    let data=useSelector(store=>store.navReducer.date)?.filter(item=>item.list===props.nameList && item.task===props.task)[0]?.date?.split(',')[0];
    let note=useSelector(store=>store.navReducer.note)?.filter(item=>item?.task===props.task && item.list===props.nameList)[0]?.task //заметки
    let repeateDays=useSelector(store=>store.navReducer.repeateForAdd)?.filter(item=>(item?.task===props.task && item?.list===props.nameList))[0]?.task;//задачи для фильтрации повтора
    let dataFlagForAdd=useSelector(store=>store.navReducer.date)?.filter(item=>(item?.task===props.task && item?.list===props.nameList))[0]?.task; // выбранная в календаре дата

    

    let moveToCompletedTasksInAddList=()=>{
        let nameComletedTask=document.getElementsByName(props.task)[0];
        if(props.check){
            dispatch(moveToActiveTasksAgainInAddingList(props.nameList,nameComletedTask.name));
        }
        else{
            dispatch(moveIntoCompletedTasks(props.nameList,nameComletedTask.name));
        }
    };

    let appearSettingsForAdd=(e)=>{
        dispatch(setWindowforAdd(props.nameList,e.currentTarget.id,true));
        document.querySelector('.keepLeftForAdd').style.width="70%";
        document.querySelector('.input-group').style.width="70%";
        
    };

   useEffect(()=>{
        if((!showForAdd?.set)){
            document.querySelector('.keepLeftForAdd').style.width="100%"
            document.querySelector('.input-group').style.width="100%"
        }else{
            document.querySelector('.keepLeftForAdd').style.width="70%";
            document.querySelector('.abc').style.width="70%"

        } 
    },[showForAdd])

    return(
       
        <div >
            {((props.flag==="#Сегодня" &&  data===new Date().toLocaleDateString()) || props.flag==='' || props.flag===`deleted${props.task}` || (props.flag==="#Завтра" &&  data===new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()))  &&
                <div>
                    <div className={styles.input}>
                        <InputGroup.Checkbox  aria-label="Checkbox for following text input"  onChange={moveToCompletedTasksInAddList} checked={props.check}  name={props.task}/>
                        <div className={props.line ? styles.lineThrought : styles.mainComponent} onClick={appearSettingsForAdd}  id={props.task}>
                            <div >{props.task}</div>
                            <div className={styles.icons}>
                                <img className={dataFlagForAdd===props.task ? styles.iconActive : styles.icon} id='calendar' src="https://cdn.icon-icons.com/icons2/620/PNG/512/calendar-with-a-clock-time-tools_icon-icons.com_56831.png" alt=""/>
                                <img className={repeateDays===props.task ? styles.iconActive : styles.icon} id='repeate' src="https://cdn.icon-icons.com/icons2/621/PNG/512/redo-circular-arrow_icon-icons.com_56886.png" alt="" />
                                <img className={note===props.task ? styles.iconActive : styles.icon} id='note' src="https://cdn.icon-icons.com/icons2/911/PNG/512/notes-edit-button_icon-icons.com_71407.png" alt="" />
                            </div>
                        </div>
                    </div>
                    {(showForAdd?.set)  && 
                        <div >
                            <AppearWindowForAdd task={showForAdd.task} check={props.check}  line={false} list={props.nameList} lineAdd={props.line}></AppearWindowForAdd>
                        </div>
                    } 
                </div>  
            }
        </div>
    )
})

export default TaskForAdd