import React, { useCallback, useEffect, useRef, useState } from "react";
import { Contract, providers } from "ethers";
import Web3Modal from "web3modal";

import { TODO_CONTRACT_ADDRESS, TODO_ABI } from "./contract";

function App() {
  const CHAIN_ID = 11155111;
  const NETWORK_NAME = "Sepolia";

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const web3ModalRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState(null);
  const [updateTodo, setUpdateTodo] = useState(null);
  const [toggling, setToggling] = useState(null);

  // Helper function to fetch a Provider instance from Metamask
  const getProvider = useCallback(async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const getSigner = web3Provider.getSigner();

    const { chainId } = await web3Provider.getNetwork();

    setAccount(await getSigner.getAddress());
    setWalletConnected(true);

    if (chainId !== CHAIN_ID) {
      window.alert(`Please switch to the ${NETWORK_NAME} network!`);
      throw new Error(`Please switch to the ${NETWORK_NAME} network`);
    }
    setProvider(web3Provider);
  }, []);

  // Helper function to fetch a Signer instance from Metamask
  const getSigner = useCallback(async () => {
    const web3Modal = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(web3Modal);

    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== CHAIN_ID) {
      window.alert(`Please switch to the ${NETWORK_NAME} network!`);
      throw new Error(`Please switch to the ${NETWORK_NAME} network`);
    }

    const signer = web3Provider.getSigner();
    return signer;
  }, []);

  // Helper function to return a Todo Contract instance
  // given a Provider/Signer
  const getTodoContractInstance = useCallback((providerOrSigner) => {
    return new Contract(TODO_CONTRACT_ADDRESS, TODO_ABI, providerOrSigner);
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      web3ModalRef.current = new Web3Modal({
        network: NETWORK_NAME,
        providerOptions: {},
        disableInjectedProvider: false,
      });

      await getProvider();
    } catch (error) {
      console.error(error);
    }
  }, [getProvider]);

  const addTodo = async (e) => {
    e.preventDefault();

    if (title === "" || description === "") {
      alert("All input fields must be filled out");
    } else {
      try {
        const signer = await getSigner();
        const todoContract = getTodoContractInstance(signer);
        const txn = await todoContract.addTodo(title, description);

        setLoading(true);
        await txn.wait();

        const contractTodos = await todoContract.showTodos();
        setTodos(contractTodos);

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const UpdateTodo = async (index) => {
    try {
      console.log("index: ", index);
  
      const signer = await getSigner();
      const todoContract = getTodoContractInstance(signer);
  
      setToggling(index);
      // Update the todo status in the contract
      const txn = await todoContract.updateTodoStatus(index);
  
      // Wait for the transaction to be mined
      await txn.wait();
  
      // Fetch the updated todo after the transaction is mined
      const newTodo = await todoContract.showTodo(index);
  
      // Update the UI state with the updated todo
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        updatedTodos[index] = newTodo;
        return updatedTodos;
      });
  
      
      setToggling(null);
  
      // Log the updated todo if needed
      console.log("Updated Todo:", newTodo);
  
    } catch (error) {
      console.error(error);
    }
  };
  

  const DeleteTodo = async (index) => {
    try {
      console.log("index: ", index);

      const signer = await getSigner();
      const todoContract = getTodoContractInstance(signer);

      const txn = await todoContract.deleteTodo(index);
      
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos];
        updatedTodos.splice(index, 1);
        return updatedTodos;
      });
      
      console.log("txn: ", txn);
      
      
      await txn.wait();
     

      
    } catch (error) {
      console.error(error);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  useEffect(() => {
    if (!walletConnected) {
      connectWallet();
    }
  }, [walletConnected, connectWallet]);

  useEffect(() => {
    const fetchTodos = async () => {
      if (account && provider) {
        try {
          const todoContract = getTodoContractInstance(provider);
          const contractTodos = await todoContract.showTodos();
          // const newContractTodo = await contractTodos.filter(todo => todo.title !== "" && todo.description !== "" && todo.isCompleted);

          setTodos(contractTodos);
          // setTodos(newContractTodo);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchTodos();
  }, [account, provider]);

  return (
    <div className="">
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-primary">
          <a className="navbar-brand text-white" href="!#">
            WID Todo Application
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav mr-auto"></ul>

            <span className="navbar-text">
              {!walletConnected ? (
                <button className="btn btn-danger" onClick={connectWallet}>
                  Connect Wallet
                </button>
              ) : (
                <button className="btn btn-dark" disabled>
                  {account !== null ? account : "Connected"}
                </button>
              )}
            </span>
          </div>
        </nav>

        {!walletConnected ? (
          <h3 className="text-center mt-5">
            Please connect your wallet to proceed.
          </h3>
        ) : (
          <>
            <div className="row mt-5">
              <div className="col-md-2"></div>

              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <form action="">
                      <div className="form-group">
                        <label htmlFor="title">Todo Title</label>
                        <input
                          onChange={handleTitleChange}
                          id="title"
                          type="text"
                          placeholder="Todo Title"
                          className="form-control"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="desc">Todo Description</label>
                        <textarea
                          onChange={handleDescriptionChange}
                          id="desc"
                          cols="30"
                          rows="10"
                          className="form-control"
                          placeholder="Todo Description"
                        ></textarea>
                      </div>

                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <button
                          onClick={addTodo}
                          className="btn btn-primary btn-lg btn-block"
                        >
                          Add Todo
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-md-2"></div>
            </div>

            <div className="row mt-5 mb-5">
              {todos !== null &&
                todos.length > 0 &&
                todos.map((todo, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <h4>{todo.title}</h4>
                        <p>{todo.description}</p>
                        {todo.isCompleted == true ? (
                          <span className="badge bg-success">Done</span>
                        ) : (
                          <span className="badge bg-warning">Undone</span>
                        )}
                        <hr />
                        <hr />

                        <button onClick={() => DeleteTodo(index)} className="btn btn-secondary">Delete Todo</button>

                        {toggling === index  ? (
                          <button className="btn btn-secondary" disabled>
                            Toggling
                          </button>
                        ) : (
                          <button
                            onClick={() => UpdateTodo(index)}
                            className="btn btn-secondary"
                          >
                           Toggle Status
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
