import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  
  useEffect(() => {
    axios.get('http://localhost:8080/api/countries')
      .then(res => setCountries(res.data))
      .catch(err => console.log(err));
  }, []);

  
  const filtered = countries.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Country Explorer</h1>
      
      {/* Search Input */}
      <input 
        type="text" 
        placeholder="Search by name..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%', maxWidth: '400px' }}
      />
      
      {/* Countries Table */}
      <table border="1" width="100%" style={{ borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Flag</th><th>Name</th><th>Capital</th><th>Region</th><th>Population</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c, i) => (
            <tr key={i} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}>
              <td><img src={c.flag} width="40" alt="flag" /></td>
              <td>{c.name}</td>
              <td>{c.capital}</td>
              <td>{c.region}</td>
              <td>{c.population.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal (Popup) */}
      {selected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', minWidth: '300px' }}>
            <h2>{selected.name}</h2>
            <img src={selected.flag} width="150" alt="flag" style={{ marginBottom: '10px' }} />
            <p><strong>Capital:</strong> {selected.capital}</p>
            <p><strong>Region:</strong> {selected.region}</p>
            <p><strong>Population:</strong> {selected.population.toLocaleString()}</p>
            <button onClick={() => setSelected(null)} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;