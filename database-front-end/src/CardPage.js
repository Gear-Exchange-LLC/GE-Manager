import React, { useContext, useEffect, useState, useMemo } from "react";
import './App.css';
import { SocketContext } from "./context/SocketContext";
import {
  useParams, useSearchParams
} from "react-router-dom";
import { useDeferredValue } from "react";

import MaterialReactTable from 'material-react-table';
import { compose } from "@mui/system";

function CardPage() {

    const socket = useContext(SocketContext);

    const { id } = useParams();

    const [data, setData] = useState({items: []});

    socket.emit("get-data");

    useEffect(() => {
      socket.on("data", (data) => {
        data.map((item) => {
          var item = JSON.parse(item)
          if (item.transactionID == id) {
            setData(item)
          }
        })
      })
    })


    const columns = useMemo(
      () => [
        {
          accessorKey: "make",
          header: "Make"
        },
        {
          accessorKey: 'model', //access nested data with dot notation
          header: 'Brand',
        },
        {
          accessorKey: 'included', //access nested data with dot notation
          header: 'Included',
        },
        {
          accessorKey: 'condition', //access nested data with dot notation
          header: 'Condition',
        },
        {
          accessorKey: 'x', //access nested data with dot notation
          header: 'X',
        },
        {
          accessorKey: 'percent', //access nested data with dot notation
          header: 'Percent',
        },
        {
          accessorKey: 'storeCredit', //access nested data with dot notation
          header: 'Store Credit',
        },
        {
          accessorKey: 'purchaseAmount', //access nested data with dot notation
          header: 'Purchase Amount',
        },
        {
          accessorKey: 'sku', //access nested data with dot notation
          header: 'SKU',
        },
        {
          accessorKey: 'storeCreditCheck', //access nested data with dot notation
          header: 'Store Credit',
        },
        {
          accessorKey: 'sellCheck', //access nested data with dot notation
          header: 'Sell Check',
          type: "boolean"
        },
      ],
      [],
    );

    function formatPhoneNumber(phoneNumberString) {
      var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
      var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      }
      return null;
    }
    
    return (
    <div className="CardPage">
      <div className="Header">
        <h1>Gear Exchange Database</h1>
        <a className="Button" href="/">Back to Dashboard</a>
      </div>
      <div className="dataWrapper">
        <h1>Name: {data.firstName} {data.lastName}</h1>
        <h2>Phone: {formatPhoneNumber(data.phoneNumber)}</h2>
      </div>
      <div className="itemWrapper">
        <MaterialReactTable columns={columns} data={data.items} />
      </div>
      <div className="buttonWrapper">
        <input type="button" className='submitButton' style={{marginRight: "10px"}} value="Edit" onClick={() => console.log("test")} />
        <input type="button" className='submitButton' value="Delete" onClick={() => console.log("test")} />
      </div>
    </div>
  );
}

export default CardPage;
