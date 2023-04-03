





let initialState={
  newLists:[{list:null,tasks:[]}],//созданные листы
  completedTasks:[{list:null,tasks:[]}],//завершенные задачи
  setWindow:[{list:null,task:'',set:false}],//открыть-закрыть окно настроек задачи
  note:[{list:'',task:'',note:''}],//заметки
  date:[{list:'',task:'',date:''}],//дата,выбранная в календаре
  isCalendarForAdd:[{list:'',task:'',check:false}],//открытие-закрытие календаря в окне настроек задач
  flagForSelectedDateFordd:[{list:'',str:''}],//фильтрация по промежутку времени
  repeateForAdd:[{list:'',task:'',days:[]}]//выбор дней для повтора задачи
  
};


const  navReducer=(state=initialState, action)=>{
    switch (action.type) {
      case 'SET_LIST_NAME':
        return {...state,newLists:[...state.newLists,{list:action.name,tasks:[]}]};

      case 'SET_TASK': return setTask(state,action)
       
      case 'DELETE_TASK': return deleteTask(state,action)
        
      case 'CHANGE_VALUE_TASK_ADD': return changeTaskValue(state,action)
       
      case 'DELETE_LIST': return deleteList(state,action)
    
      case 'MOVE_INTO_COMPLETED_TASKS': return moveToCompleted(state,action)
        
      case 'MOVE_INTO_ACTIVE_TASKS':return moveToActive(state,action)
        
      case 'SET_WINDOW_FOR_ADD':return setWindow(state,action)
        
      case 'CHANGE_TASK_TEXT_FOR_ADD':return changeTaskText(state,action)
        
      case 'CHOOSE_REPEATE_FOR_ADD': return setRepeatedDays(state,action)
        
      case 'HAS_NOTE_ADD': return setNote(state,action)
      
      case 'SET_DATA':return  setData(state,action)
        
      case 'IS_CALENDAR_FOR_ADD':return isCalendar(state,action)
        
      case 'SET_FLAG_FOR_ADD':return setSelectedDay(state,action) 
          
    default:
        return state;
    }
}


let setTask=(state,action)=>{
  debugger
  state.newLists.forEach((item,i)=>{

    if(item.list===action.name){
      item.tasks.push(action.task)
    }

  })

  return {...state,newLists:[...state.newLists]};
}


let changeTaskValue=(state,action)=>{

  state.newLists.forEach(item=>{

    if(item.list===action.list){

      item.tasks.forEach((i,index,arr)=>{
        if(i===action.def){

          arr[index]=action.add
        }

      })
    }
  })

  return {...state,newLists:[...state.newLists]}

}


let deleteList=(state,action)=>{

  state.newLists.forEach((item,i,arr)=>{

    if(item.list===action.list){
       arr.splice(i,1);
    }

  });

  return {...state,newLists:[...state.newLists]}
}

let moveToActive=(state,action)=>{


  let prevTask;
  let move_to_active_flag
  let notFoundPrevCount=1


  state.completedTasks.forEach((item,i,arr)=>{

    if(item.list===action.listName){

        arr[i].tasks.forEach((elem,index,mass)=>{

          if(elem.current===action.task){
            mass.splice(index,1);
            prevTask=elem.previous;
          }

        })
    }
  })


  state.newLists.forEach((item,i,arr)=>{

    if(item.list===action.listName){

      item.tasks.forEach((el,index,mass)=>{
        
        if(el===prevTask){
          if(mass.length>1){
            mass.push(action.task);
            mass.push(...mass.splice(index+1))
          }else{
            mass.push(action.task)
          }
          notFoundPrevCount+=2;
        }
      })

      if(prevTask===null ||notFoundPrevCount===1){
        item.tasks.unshift(action.task);
      }

      if(item.tasks.length===0){
        item.tasks.push(action.task)
      }
    
      return move_to_active_flag=true

    }else{

      return move_to_active_flag=false;
    }

  })

  if(move_to_active_flag===false){
    state.newLists.unshift({list:action.listName,tasks:[action.task]})
  }

  return {...state,newLists:[...state.newLists],completedTasks:[...state.completedTasks]}
}


let moveToCompleted=(state,action)=>{


  let previousTask
  let move_to_competed_flag

  state.newLists.forEach((item,i)=>{

    if(item.list===action.listName){
      item.tasks.forEach((element,ind,array)=>{

        if(action.task===element){
          array[ind-1]?previousTask=array[ind-1]:previousTask=null
        }

      })

      state.completedTasks.forEach((elem,index,arr)=>{

        if(elem.list===action.listName){
          elem.tasks.push({current:action.task,previous:previousTask})
          return move_to_competed_flag=true;

        }
        else{
          return move_to_competed_flag=false;
        }
      });

      if(move_to_competed_flag===false){
        state.completedTasks.push({list:action.listName,tasks:[{current:action.task,previous:previousTask}]})
      }

      item.tasks.length>1 ? item.tasks=item.tasks.filter(item=>item!==action.task) : item.tasks.splice(0,1)
    }
  })

  return {...state,newLists:[...state.newLists],completedTasks:[...state.completedTasks]}
}

let setWindow=(state,action)=>{


  let flagForSetWindow=false;

  state.setWindow.forEach(element=>{

    if(element.set===true){
      element.set=false
    }

    if(element.list===action.listName && element.task===action.task){
      element.set=action.set;
      flagForSetWindow=true
    }

  })

  if(!flagForSetWindow){
    state.setWindow.push({list:action.listName,task:action.task,set:action.set})
  }

  return {...state,setWindow:[...state.setWindow]};
}

let changeTaskText=(state,action)=>{


  state.newLists.forEach((item)=>{
    if(item.list===action.listName){

      item.tasks.forEach((i,index,arr)=>{

        if(i===action.def){
         arr[index]=action.cur

        }

      })
    }

  })

  
  state.note.forEach((item,i,arr)=>{

    if(item.list===action.listName && item.task===action.def){
      arr[i].task=action.cur
    }

  })


  state.date.forEach((item,i,arr)=>{

    if(item.list===action.listName && item.task===action.def){
      arr[i].task=action.cur
    }

  })


  return {...state,newLists:[...state.newLists],note:[...state.note],date:[...state.date]};
}


let setRepeatedDays=(state,action)=>{
  let repeated_flag=false

  state.repeateForAdd.forEach((item,i,arr)=>{

    if(item?.task===action.task && item.list===action.list){
      arr[i].days=action.days
      if(action.days.length===0) delete arr[i]
      repeated_flag=true
      
    }

  })

  if(!repeated_flag){
    state.repeateForAdd.push({list:action.list,task:action.task,days:action.days})
  }

  return {...state,repeateForAdd:[...state.repeateForAdd]};
}

let setNote=(state,action)=>{
  let flagForNote=false

  state.note.forEach((item,i,arr)=>{

    if(item?.list===action.listName && item?.task===action.task){
      if(action.value==='') delete arr[i]
      item.note=action.value;
      flagForNote=true;
    }

  })

  if(!flagForNote){
    state.note.push({list:action.listName,task:action.task,note:action.value})
  }

  return {...state,note:[...state.note]};
}

let setData=(state,action)=>{
  let flagForData=false

  state.date.forEach(item=>{

    if(item.list===action.listName && item.task===action.task){
      item.date=action.date
      flagForData=true
    }

  })
  if(!flagForData){

    state.date.push({list:action.listName,task:action.task,date:action.date})

  }
  return {...state,date:[...state.date]}
}
let isCalendar=(state,action)=>{
  let flagForCalendar=false

  state.isCalendarForAdd.forEach(item=>{

    if(item.list===action.listName && item.task===action.task){
      item.check=action.check
      flagForCalendar=true
    }

  })

  if(!flagForCalendar){
    state.isCalendarForAdd.push({list:action.listName,task:action.task,check:action.check})
  }

  return {...state,isCalendarForAdd:[...state.isCalendarForAdd]}
}

let deleteTask=(state,action)=>{
  state.newLists.forEach(item=>{

    if(item.list===action.nameList){
      item.tasks=item.tasks.filter(oldTask=>oldTask!==action.task)
      
    }

  })

  state.completedTasks.forEach((elem,i,arr)=>{

    if(elem.list===action.nameList){
      elem.tasks=elem.tasks.filter(oldTask=>oldTask.current!==action.task)
    }

  })

  return {...state,newLists:[...state.newLists],completedTasks:[...state.completedTasks]}
}

let setSelectedDay=(state,action)=>{
  let flagForFilterDate=false

  state.flagForSelectedDateFordd.forEach(item=>{

    if(item.list===action.list){
      item.str=action.str;
      flagForFilterDate=true;
    }

  })

  if(!flagForFilterDate){
    state.flagForSelectedDateFordd.push({list:action.list,str:action.str})
  }

  return {...state,flagForSelectedDateFordd:[...state.flagForSelectedDateFordd]};
}




export const setListName=(name)=>{
  return {
      type:'SET_LIST_NAME',name
  }
};
export const setTasks=(name,task)=>{
  return {
      type:'SET_TASK',name,task
  }
};
export const deleteTaskFromAddingList=(nameList,task)=>{
  return {
      type:'DELETE_TASK',nameList,task
  }
};
export const changeAddListTaskTextCreator=(list,def,add)=>{
  return {
      type:'CHANGE_VALUE_TASK_ADD',list,def,add
  }
};
export const deleteListCreator=(list)=>{
  return {
      type:'DELETE_LIST',list
  }
};
export const moveIntoCompletedTasks=(listName,task)=>{
  return {
      type:'MOVE_INTO_COMPLETED_TASKS',listName,task
  }
};
export const moveToActiveTasksAgainInAddingList=(listName,task)=>{
  return {
      type:'MOVE_INTO_ACTIVE_TASKS',listName,task
  }
};
export const setWindowforAdd=(listName,task,set)=>{
  return {
      type:'SET_WINDOW_FOR_ADD',listName,task,set
  }
};
export const changeTaskTextForAdd=(listName,def,cur)=>{
  return {
      type:'CHANGE_TASK_TEXT_FOR_ADD',listName,def,cur
  }
};
export const hasNoteForAdd=(listName,task,value)=>{
  return {
      type:'HAS_NOTE_ADD',listName,task,value
  }
};
export const setDataForAdd=(listName,task,date)=>{
  return {
      type:'SET_DATA',listName,task,date
  }
};
export const isCalendarForAdd=(listName,task,check)=>{
  return {
      type:'IS_CALENDAR_FOR_ADD',listName,task,check
  }
};
export const setFlagForSelectedDateForAdd=(list,str)=>{
  return {
      type:'SET_FLAG_FOR_ADD',list,str
  }
};
export const chooseRepeateForAdd=(list,task,days)=>{
  return {
      type:'CHOOSE_REPEATE_FOR_ADD',list,task,days
  }
};





export default navReducer