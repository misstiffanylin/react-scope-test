let storage = {};

chrome.devtools.panels.create(
  'React-Scope-Test',//title of the panel
  null, //the path to the icon
  'devtools.html', //html page for injecting into the tab's content
  sendMessage //callback function optional
);

function sendMessage() {
  console.log('React-Scope-Test s Console')
  let port = chrome.runtime.connect({
    name: "lcmkobafpahiadgbnmjhhgoibckdbeko",
  });
  port.postMessage({
    name: 'connect', 
    tabId: chrome.devtools.inspectedWindow.tabId
  })
  port.onMessage.addListener((msg) => {
    if (!msg.data) {
      console.log(msg)
      console.log('There is no data');
    }
    else {
      console.log("data is here")
      storage = msg;
      storage = storage.data.head.value.currentState[1].children[3]
      const data = [];
        while(storage) { // while storage isn't null, continue
          // if (storage.name) { // add to data obj if there is a name property
            console.log('looping')
            if(storage.children.length > 1) {
              for (keys in storage.children.length) {
                data.push(getChildren(keys))
              }
            } else {
              data.push({
                name : storage.name,
                props : storage.props,
                state : storage.states,
              })
            }
          // }
          storage = storage.children[Object.keys(storage.children)[0]]
        }
        // console.log(storage.data.head.value.currentState[1].children[3])
      
      function getChildren(child) {
        while(child) { // while storag isn't null, continue
        // if (child.name) { // add to data obj if there is a name property
          console.log('looping')
          if(child.children.length > 1) {
            data.push()
          }
          data.push({
            name : child.name,
            props : child.props,
            state : child.states,
          })
        // }
        child = child.children[Object.keys(storage.children)[0]]
      }
      }

      console.log(data)
      // let example = 'hello';
      // var node = document.createElement('h4');
      // var textnode = document.createTextNode(example);
      // node.appendChild(textnode);
      // document.getElementById('app').appendChild(node);

    }
  })
};


