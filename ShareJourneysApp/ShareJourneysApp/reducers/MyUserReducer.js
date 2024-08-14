const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        
        case "login":
            return action.payload;
        case "logout":
            return action.payload;
        case "editProfile":
            return action.payload
                

    }
    console.log(currentState)
    return currentState;
}
    
export default MyUserReducer;

