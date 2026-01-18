const ADD_COLUMN = 'ADD_COLUMN';
const UPDATE_COLUMN = 'UPDATE_COLUMN';
const DELETE_COLUMN = 'DELETE_COLUMN';
const ADD_PROJECT_WITH_COLUMNS = 'ADD_PROJECT_WITH_COLUMNS';
const REORDER_COLUMNS = 'REORDER_COLUMNS';

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
        
        case REORDER_COLUMNS:
            // Update order for columns in the specified project
            return state.map(column => {
                if (column.projectId === action.payload.projectId) {
                    const newOrder = action.payload.columnIds.indexOf(column.id);
                    return newOrder !== -1 ? { ...column, order: newOrder } : column;
                }
                return column;
            });
            
        default:
            return state;
    }

}

export default columnReducer;