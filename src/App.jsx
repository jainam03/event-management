import React, { useState, useEffect } from "react";
import Web3 from "web3";

import "./App.css";

function App() {
  const [eventPrice, setEventPrice] = useState("");
  // const [defaultAccount, setDefaultAccount] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [ticketCount, setTicketCount] = useState("");

  const [web3, setWeb3] = useState(new Web3("http://localhost:8545"));
  const [contractAddress] = useState(
    "0x9aa9ebB48CCb0E56F9f21dDc338279Fd0e629570"
  );
  const abi = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "events",
      outputs: [
        {
          internalType: "address",
          name: "organizer",
          type: "address",
        },
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ticketCount",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ticketRemain",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [],
      name: "nextId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "tickets",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "date",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ticketCount",
          type: "uint256",
        },
      ],
      name: "createEvent",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
      ],
      name: "buyTicket",
      outputs: [],
      stateMutability: "payable",
      type: "function",
      payable: true,
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "quantity",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
      ],
      name: "transferTicket",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const [eventContract] = useState(new web3.eth.Contract(abi, contractAddress));

  const createEvent = async () => {
    try {
      // Convert eventDate to Unix timestamp
      const eventDateUnix = new Date(eventDate).getTime() / 1000;

      await eventContract.methods
        .createEvent(eventName, eventDateUnix, eventPrice, ticketCount)
        .send({ from: web3.eth.defaultAccount, gas: 2000000 });
      console.log("event created")
      alert("Event created")
    }
    catch (error) {
      console.error(error)
      alert("Error creating event")
    }
  };

  const buyTicket = async () => {
    try {
      const eventId = document.getElementById("eventId").value;
      const buyQuantity = document.getElementById("buyQuantity").value;

      await eventContract.methods.buyTicket(eventId, buyQuantity).send({
        from: defaultAccount,
        gas: "2000000",
        value: web3.utils.toWei((eventPrice * buyQuantity).toString(), "ether"),
      });
    } catch (error) {
      console.error(error)
      alert("Error buying ticket")
    }
  };

  const transferTicket = async () => {
    try {
      const eventId = document.getElementById("eventId").value;
      const transferQuantity = document.getElementById("transferQuantity").value;
      const transferTo = document.getElementById("transferTo").value;

      await eventContract.methods
        .transferTicket(eventId, transferQuantity, transferTo)
        .send({ from: defaultAccount, gas: 2000000 });
    } catch (error) {
      console.error(error)
      alert("Error transferring ticket")
    }
  };

  return (
    <div>
      <h1>Event Contract UI</h1>

      <label htmlFor="eventName">Event Name:</label>
      <input
        type="text"
        id="eventName"
        placeholder="Enter Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <label htmlFor="eventDate">Event Date:</label>
      <input
        type="datetime-local"
        id="eventDate"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      />

      <label htmlFor="eventPrice">Ticket Price (ETH):</label>
      <input
        type="number"
        id="eventPrice"
        placeholder="Enter Ticket Price"
        value={eventPrice}
        onChange={(e) => setEventPrice(e.target.value)}
      />

      <label htmlFor="ticketCount">Ticket Count:</label>
      <input
        type="number"
        id="ticketCount"
        placeholder="Enter Ticket Count"
        value={ticketCount}
        onChange={(e) => setTicketCount(e.target.value)}
      />

      <button onClick={() => createEvent()}>Create Event</button>

      <hr />

      <label htmlFor="eventId">Event ID:</label>
      <input type="number" id="eventId" placeholder="Enter Event ID" />

      <label htmlFor="buyQuantity">Quantity:</label>
      <input type="number" id="buyQuantity" placeholder="Enter Quantity" />

      <button onClick={buyTicket}>Buy Ticket</button>

      <hr />

      <label htmlFor="transferQuantity">Transfer Quantity:</label>
      <input type="number" id="transferQuantity" placeholder="Enter Quantity" />

      <label htmlFor="transferTo">Transfer To Address:</label>
      <input
        type="text"
        id="transferTo"
        placeholder="Enter Recipient Address"
      />

      <button onClick={transferTicket}>Transfer Ticket</button>
    </div>
  );
}

export default App;
