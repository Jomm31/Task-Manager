const ADD_PROJECT = 'ADD_PROJECT';
const UPDATE_PROJECT = 'UPDATE_PROJECT';
const DELETE_PROJECT = 'DELETE_PROJECT';

const initialState = [];

function projectReducer(state = initialState, action){
    switch (action.type){
        case ADD_PROJECT:
            return [...state, action.payload];
        
        case UPDATE_PROJECT:
            return state.map(project =>
                project.id === action.payload.id 
                ? {...project, ...action.payload}
                : project
            )
        
            case DELETE_PROJECT:
                return state.filter(project => project.id !== action.payload)

        default:
            return state;
    }
}

export default projectReducer;