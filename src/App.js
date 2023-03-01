import { useState, useRef, useEffect } from 'react';

function App() {
  const [listItems, setListItems] = useState([]);

  const ulRef = useRef();

  const handleRemove = (index) => () => {
    listItems.splice(index, 1);
    setListItems([...listItems]); 
  };

  const handleAdd = () => {
    listItems.push(100);
    setListItems([...listItems]);
  };

  useEffect(() => {
    const handler = {
      get: (target, prop, receiver) => {
        if (prop === 'push') {
          return (value) => {
            target[prop](value);
            const li = document.createElement('li');
            li.textContent = value;
            ulRef.current.appendChild(li);
          };
        } else if (prop === 'splice') {
          return (...args) => {
            const result = target[prop](...args);
            args.forEach((arg) => {
              if (typeof arg === 'number' && arg < target.length) {
                ulRef.current.removeChild(ulRef.current.childNodes[arg]);
              }
            });
            return result;
          };
        } else {
          return target[prop];
        }
      }
    };

    setListItems(new Proxy(listItems, handler));
  }, []);


  return (
    <>
      <button onClick={handleAdd}>Add Item</button>
      <ul ref={ulRef}>
        {listItems.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
