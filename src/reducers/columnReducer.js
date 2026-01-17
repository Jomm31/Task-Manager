const ADD_COLUMN = 'ADD_COLUMN';
const UPDATE_COLUMN = 'UPDATE_COLUMN';
const DELETE_COLUMN = 'DELETE_COLUMN';
const ADD_PROJECT_WITH_COLUMNS = 'ADD_PROJECT_WITH_COLUMNS';

const initialState = [];

function columnReducer(state = initialState, action){
    switch(action.type){
        case ADD_COLUMN:
            return [...state, action.payload];
        
        case UPDATE_COLUMN:
            return state.map(column =>
                column.id === action.payload.id 
                ? {...column, ...action.payload}
                : column
            )
            
        case DELETE_COLUMN:
            return state.filter(column => column.id !== action.payload);
        
        case ADD_PROJECT_WITH_COLUMNS:
            return [...state, ...action.payload.columns];
            
        default:
            return state;
    }

}

export default columnReducer;