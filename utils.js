// a function to limit calls by the delay argument
const debounce = (callbackFunction, delay = 1000) => {
    let timeoutId;
    return (...args) => { // can take multiple arguments
        if(timeoutId) {
            clearTimeout(timeoutId); // prevent from making too many calls to the API
        }
        timeoutId = setTimeout(() =>{
            // apply for many args or null in case of no args
            callbackFunction.apply(null, args);
        }, delay);
    };
};

var conf = {
    MY_KEY : '752e2a6c',
    SECRET_KEY : '456gyhju',
    KEY_2 : 'sadf56k1'
   };