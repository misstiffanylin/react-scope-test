const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers;
const reactInstance = reactInstances[Object.keys(reactInstances)[0]];
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
// alert(JSON.stringify(reactInstance));
let reactDOM;

devTools.onCommitFiberRoot = (function (original) {
  return function(...args) {
      reactDOM = args[1];
    tester();
    return original(...args);
  }
})(devTools.onCommitFiberRoot);

//Example way of getting state that's an array;
// function tester () {
//   let ourState = reactDOM.current.stateNode.current.child.memoizedState;
//   getState(ourState);
// }
  
// function getState(state) {
//   for (let key in state) {
//     if (state[key].constructor === Array) {
//       let arr = state[key];
//       for (let i = 0; i < arr.length; i++) {
//         console.log(arr[i]);
//     }
//     }
//   }
// }

//async version -- should we check for older browsers?!?!?! or use promises?! Ask Jon.
async function tester () {
  try {
    var state = await reactDOM.current.stateNode.current.child.memoizedState;
  } catch(e) {
    console.log('error: ' + e);
  }
  for (let key in state) {
    if (state[key].constructor === Array) {
      let arr = state[key];
      for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
    }
  }
}
  
