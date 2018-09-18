const {ipcRenderer}  = window.electron;

let pendingRequests = {};

const randomId = () => `${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;

// util method to resolve a promise from outside function scope
// https://stackoverflow.com/questions/26150232/resolve-javascript-promise-outside-function-scope
class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject)=> {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

export const emit = (action, payload) => {
  // create a request identifier
  const requestId = randomId();

  // send ipc call on async-request channel
  ipcRenderer.send('asyncRequest', requestId, action, payload);

  // create a new deferred object and save it to pendingRequests
  // this allows us to resolve the promise from outside (giving a cleaner api to domain objects)
  const dfd = new Deferred();
  pendingRequests = {...pendingRequests, [requestId]: {dfd, action, payload}};

  // return a promise which will resolve with res
  return dfd.promise;
};

export const setupFrontendListener = () => {
  ipcRenderer.on('asyncResponse', (event, requestId, res) => {
    const {dfd, action} = pendingRequests[requestId];
    dfd.resolve(res);

    // remove the pendingRequest
    pendingRequests = Object.keys(pendingRequests)
      .filter(k => k !== requestId)
      .map(k => ({[k]: pendingRequests[k]}))
      .reduce((accumulator, current) => ({...accumulator, ...current}), {})
    ;
  });

  ipcRenderer.on('errorResponse', (event, requestId, err) => {
    const {dfd, action} = pendingRequests[requestId];
    dfd.reject(err);
  });
}