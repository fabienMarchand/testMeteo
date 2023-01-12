import React, { useEffect, useState } from 'react';
import axios from 'axios';


import Table from './components/Table';

const App = () => {
  const [dataTable, setdataTable] = useState([]);

  useEffect(() => {
    const requestTest = async () => {
      await axios
        .get(`http://localhost:8080/meteo/city`)
        .then((res) => {
          console.log(res.data);
          setdataTable(res.data);
        })
        .catch((error) => console.log(error));
    };

    requestTest();
  }, []);

  const column = [
    {heading: 'Code Insee', value: 'insee'},
    {heading: 'City', value:'name'},
    {heading: 'Population', value:'population'}
  ]


  return (
    <div className="app">
       <h1>Dynamic Table</h1>
      <Table data={dataTable} column={column} />
    </div>
  );
};

export default App;
