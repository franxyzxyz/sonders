import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

function count(state = 0, action) {
  switch (action.type) {
    case 'ADD_COUNT':
      return state + 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  count,
});

module.exports = {
  configureStore: initialState =>
   createStore(rootReducer, initialState, applyMiddleware(
    thunkMiddleware,
  )),
};
