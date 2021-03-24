import React, { useState, useEffect } from 'react';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Handle,
} from "react-flow-renderer";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
const port = chrome.runtime.connect({ name: "Atomos" });

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const ComponentTree = () => {
  // once state is changed loading is false
  const [loading, setLoading] = useState(true);
  const [elements, setElements] = useState([]);

  // react flow functionality
  const onElementsRemove = (elementsToRemove) =>
    setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  // Received fiber node state changes from reactFileParser
  useEffect(() => {
    // establish a connection between devtools and background page
    port.postMessage({
      name: 'connect',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
    // saving data to ReactfileParser
    port.onMessage.addListener((message) => {
      setLoading(false);
      setElements(message);
    });
  }, []);

  // if loading, ask for a state change
  if (loading) {
    return (
      <div>
        <h1>Trigger state change to render component tree</h1>
      </div>
    );
  }

  // render component tree after state was changed
  return (
    <div style={{ height: "85vh" }}>
      <Navbar>
        <Nav>
          <NavDropdown title="Atoms" id="basic-nopav-dropdown">
            {elements
              .reduce((acc, el) => {
                if (el.atom) {
                  if (!acc.includes(el.atom)) {
                    acc.push(el.atom);
                  }
                }
                return acc;
              }, [])
              .map((el) => (
                <NavDropdown.Item
                  onClick={() => {
                    // update ReactFlow node elements and change styling
                    const updatedTree = elements.map((node) => {
                      if (node.atom === el) {
                        node.style = {};
                        node.style.border = "4px solid #c40a0a";
                      } else {
                        node.style = {};
                      }
                      return node;
                    });
                    setElements(updatedTree);
                  }}
                >
                  {el}
                </NavDropdown.Item>
              ))}
          </NavDropdown>
          <NavDropdown title="Selectors" id="basic-nopav-dropdown">
            {elements
              .reduce((acc, el) => {
                if (el.selector) {
                  if (!acc.includes(el.selector)) {
                    acc.push(el.selector);
                  }
                }
                return acc;
              }, [])
              .map((el) => (
                <NavDropdown.Item
                  onClick={() => {
                    // update ReactFlow node elements and change styling
                    const updatedTree = elements.map((node) => {
                      if (node.selector === el) {
                        node.style = {};
                        node.style.border = "4px solid #1ef7a4";
                      } else {
                        node.style = {};
                      }
                      return node;
                    });
                    setElements(updatedTree);
                  }}
                >
                  {el}
                </NavDropdown.Item>
              ))}
          </NavDropdown>
        </Nav>
      </Navbar>
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Handle style={{ color: "#1a192b" }} />
        <MiniMap
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            if (n.type === "input") return "#0041d0";
            if (n.type === "output") return "#1a192b";
            if (n.type === "default") return "#1a192b";
            return "#eee";
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return "#fff";
          }}
          nodeBorderRadius={1}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default ComponentTree;

/** **** CONSOLE LOGS RUN IN DEVTOOLS CONSOLE ***** */
// console.log('App.jsx is loaded');
// create backend file to manifest.json to access react devtool
// console.log('App.jsx window', window);
// const dev = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
// console.log('react dev tools -- App.jsx', dev);

// console.log('chrome tabs -- App.jsx', chrome.tabs);
// console.log('chrome -- App.jsx', chrome);
