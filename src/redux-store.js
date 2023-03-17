import { applyMiddleware, combineReducers, createStore } from "redux"
import thunk from 'redux-thunk'
import navReducer from './reducers/nav-reducer'
import plainedReducer from './reducers/plained-reducer'

let reducers=combineReducers({
    plainedReducer,
    navReducer
});
let store=createStore(reducers,applyMiddleware(thunk));
export default store;