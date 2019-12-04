const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const [state, dispatch] = useReducer((state, action) => {
    return Object.assign(state, { [action.eventName]: action.payload });
}, initialState);


const EventProvider = ({ children }) => {
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

function storeEvent(eventName, value) {
    dispatch({ eventName, payload: value })
}

function deleteEvent(eventName) {
    dispatch({ eventName, payload: undefined });
}

function subscribeToEvent(eventName) {
    const globalState = useContext(store);
    return globalState[eventName]
}

export {
    EventProvider,
    storeEvent,
    deleteEvent,
    subscribeToEvent 
}