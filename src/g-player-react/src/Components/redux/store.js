import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import {GPSaga} from './GPSaga';
import { GPReducer } from './GPReducer';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(GPReducer,
                            composeWithDevTools(applyMiddleware(sagaMiddleware))
                            );
sagaMiddleware.run(GPSaga);

export default store;