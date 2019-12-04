/*******************************************************************************************************************
 * Utility method that Manages state, persist api response and notify back by callback method provided as param 
 * Also based on Internet connectivity, can save api call which require less attention and invoke them later 
 * Supports app working even when device is not connected any network
 * 
 * This library maintains list of events available for subscription and subscribed events 
 ******************************************************************************************************************/
const isEqualObject = require('./src/utils/is-equal-object');

/**
 * Store contains list of all events and apis which is having data and can be subscribed
 * Store Object will have eventName as key which would be api incase of api call persistence otherwise an event name.
 * against each eventName there would be an object having data and
 * objParams(optional). objParams are used in case of api call to make sure that
 * data is returned for same set of params.
 * format=>  {[eventName]: ANY };
 */
const store = {};

/**
 * SubscribedEvent will store all events which is currently being subscribed and
 * actively looking into the same
 * format=>  {[eventName]: [<function>]}
 */
const subscibedEvent = {};

/**
 * Register Event
 * @param {string} eventName - event name / data point name
 * @param {*} defaultValue - default initial value
 * @param {boolean} transmit -
 */
function storeEvent(eventName, defaultValue, transmit = true) {
    store[eventName] = defaultValue;
    if (transmit) { transmitToAllEvent(eventName, defaultValue) }
}

function deleteEvent(eventName) {
    delete store[eventName];
}

function subscribeToEvent(eventName, callback) {
    const events = subscibedEvent[eventName] || [];

    const index = isAlreadySubscribed(events, callback);
    if (index === false) {
        events.push(callback);
    } else {
        events[index] = callback
    }

    subscibedEvent[eventName] = events;

    transmitToSingleEvent(eventName, callback);
}

function transmitToAllEvent(eventName) {
    let eventDetail, subscribedEvent;

    const eventDetail = store[eventName];
    const subscribedEvent = subscibedEvent[eventName];

    if (!Array.isArray(subscribedEvent) || !eventDetail) {
        return;
    }

    subscribedEvent.forEach(event => {
        if (event && typeof event == 'function') {
            event();
        }
    });
}

function transmitToSingleEvent(eventName, callback) {
    if (!(eventName && callback && typeof callback == 'function')) {
        return;
    }

    const eventDetail = store[eventName];
    callback(eventDetail);
}

function isEventAvailable(eventName) {
    if (!eventName) { return false };

    return !!store[eventName];
}

function unsubscribeEvent(eventName, callback) {
    const events = subscibedEvent[eventName];
    const index = isAlreadySubscribed(events)

    if (index !== false) {
        events.splice(index, 1);
    }

    subscibedEvent[eventName] = events;
}

function isAlreadySubscribed(events, callback) {
    if (!(Array.isArray(events) && events.length)) {
        return false;
    }

    for (const i in events) {
        const event = events[i];
        if (event && typeof event == 'function' && callback && typeof callback == 'function' && event.toString() == callback.toString()) {
            return i;
        }
    }

    return false;
}

export {
    storeEvent,
    deleteEvent,
    subscribeToEvent,
    transmitToAllEvent,
    isEventAvailable,
    unsubscribeEvent
}