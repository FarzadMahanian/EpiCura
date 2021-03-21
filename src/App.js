import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

import "./style.scss";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    axios
      .get(`https://backend-staging.epicuramed.it/operationtypes`)
      .then((response) => {
        if (response.status === 200) {
          setIsLoaded(true);
          setItems(
            response.data.sort(function (a, b) {
              return parseInt(a.order) - parseInt(b.order);
            })
          );
        } else {
          setIsLoaded(true);
          setError(error);
        }
      })
      .catch((error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, []);

  const filterData = (e) => {
    if (e.target.value.length >= 2) {
      setSearchText(e.target.value.toLowerCase());
    } else {
      setSearchText("");
    }
  };

  return (
    <>
      <header className="App-header">
        <h1>EpiCure</h1>
      </header>

      <section className="App-content">
        {error && <h2>Error: {error.message}</h2>}

        {!isLoaded && <h2>Loading...</h2>}

        {isLoaded && !error && (
          <>
            <input
              type="text"
              onChange={filterData}
              placeholder="Search..."
              autoFocus
            />

            <table className="App-table">
              <thead>
                <tr>
                  <th>Label (it)</th>
                  <th>Has notes</th>
                  <th>Numerosity</th>
                  <th>Updated at</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const lable = item.label_it.toLowerCase();
                  const discipline = item.discipline.label_it.toLowerCase();
                  if (
                    (lable.includes(searchText) ||
                      discipline.includes(searchText)) &&
                    searchText !== ""
                  ) {
                    return (
                      <tr key={item._id}>
                        <td>{item.label_it}</td>
                        <td>
                          {item.hasNotes ? (
                            <span className="tag tag--true">TRUE</span>
                          ) : (
                            <span className="tag tag--false">FALSE</span>
                          )}
                        </td>
                        <td>{item.numerosity}</td>
                        <td>
                          {moment(item.updatedAt).format(
                            "DD/MMM/YYYY - HH:MM:SS"
                          )}
                        </td>
                      </tr>
                    );
                  }
                })}

                {searchText === "" && (
                  <tr className="no-data-container">
                    <td colSpan={4}>
                      <h2>There is no data.</h2>
                      <h3>Please search for data.</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </section>
    </>
  );
}

export default App;
