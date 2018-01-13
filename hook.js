// const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers;
// const reactInstance = reactInstances[Object.keys(reactInstances)[0]];
// const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
// alert(JSON.stringify(reactInstance));
// let reactDOM;

// devTools.onCommitFiberRoot = (function (original) {
//   return function(...args) {
//       reactDOM = args[1];
//     tester();
//     return original(...args);
//   }
// })(devTools.onCommitFiberRoot);

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
// async function tester () {
//   try {
//     var state = await reactDOM.current.stateNode.current.child.memoizedState;
//   } catch(e) {
//     console.log('error: ' + e);
//   }
//   for (let key in state) {
//     if (state[key].constructor === Array) {
//       let arr = state[key];
//       for (let i = 0; i < arr.length; i++) {
//         console.log(arr[i]);
//     }
//     }
//   }
// }

//branch1
const reactInstances = window.__REACT_DEVTOOLS_GLOBAL_HOOK__._renderers;
const reactInstance = reactInstances[Object.keys(reactInstances)[0]];
const devTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
let reactDOM;
let currState;

devTools.onCommitFiberRoot = (function (original) {
  return function(...args) {
      reactDOM = args[1];
			currState = checkReactDOM();
			console.log('is this running?')
			getInitialState();    			
			sendState();
      return original(...args);
  }
})(devTools.onCommitFiberRoot);



function getInitialState() {
	console.log('currState', currState);
}

//async version -- should we check for older browsers?!?!?! or use promises?! Ask Jon.
async function sendState() {
  // try {
  //   var state = a wait reactDOM.current.stateNode.current.child.memoizedState;
  // } catch(e) {
  //   console.log('error: ' + e);
  // }
  // for (let key in state) {
  //   if (state[key].constructor === Array) {
  //     let arr = state[key];
  //     for (let i = 0; i < arr.length; i++) {
  //       // console.log(arr[i]);
  //   }
  //   }
  // }
  // console.log('currState', currState);
  var saveCache = new StateCache();
  // saveCache.addToHead(currState);
  console.log('before', saveCache);    
  stateListener(saveCache);
}

const traverseComp = function (node, cache) {

	//LinkedList Style
	const component = {
		name: "", 
		state: null, 
		props: null, 
		children: {}, 
	};

	//consider using switch/case 
	if (node.type) {
		if (node.type.name) {
			component.name = node.type.name;
		}
		else {
			component.name = node.type || "Default";
		}
	}

	if (node.memoizedState) {
		component.state = node.memoizedState;
	}

	if (node.memoizedProps) {
		let props = [];
		if (typeof node.memoizedProps === "object") {
			let keys = Object.keys(node.memoizedProps);
			keys.forEach((key) => {
				props.push(node.memoizedProps[key])
			})
			component.props = props[0] || props; //need to parse the props if it is a function or an array or an object
		}
		else {
			component.props = node.memoizedProps
		}
	}
	
	if (node._debugID) {
		cache[node._debugID] = component
	}
	else if (!node._debugID) {
		cache["Default ID"] = component
	}

	if (node.child !== null) {
		traverseComp(node.child, component.children)
	}
	if (node.sibling !== null) {
		traverseComp(node.sibling, component.children)
	}
}

//check if reactDOM is even valid 
async function checkReactDOM() {
	let data = {currentState: null};
	let cache = {};
	if (reactDOM) {
		// console.log(reactDOM.current)
		traverseComp(reactDOM.current, cache); //maybe there is no need to use stateNode.current
	}
	else {
		return;
	}
	data.currentState = cache;
  console.log("Store with Hierarchy: ", data);
  return data;
}
 



//Here we are using a doubly linked list to store state changes

function StateCache() {
  this.head = null;
  this.tail = null;
}

function Node(val) {
  this.value = val;
  this.next = null;
  this.prev = null;
}

StateCache.prototype.addToHead = function(value) {
  const node = new Node(value);
  if(!this.head) {
		this.head = this.tail = node;
  } else {
		let curr = this.head;
		this.tail = node;
		curr.next = node;
		node.prev = curr;
  }
}


function stateListener(cache) {
  //create stateCache to head of linked list, which contains the initial state upon app start;
  //listen for state changes 
  //on state change: 
  //assign current state to currentState.next;
  //new state will be currentState (the head)
  if (cache.head === null) {
    cache.addToHead(currState);
  }
  if (currState !== cache.head) {
    cache.addToHead(currState);
  }
}

// var testCache = new StateCache();
// testCache.addToHead(1);
// testCache.addToHead(2);
// testCache.addToHead(3);
// console.log(testCache);

