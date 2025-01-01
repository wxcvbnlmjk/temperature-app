import React from 'react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";

interface TemperatureData {
  tx: number;
  tn: number;
  tm: number;
  date: string;
  ville: string;
}

interface FilteredTemp {
  tx: number;
  tn: number;
  tm: number;
  date: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr.length !== 8) {
    return "Date invalide";
  }
  const annee = dateStr.substring(0, 4);
  const mois = dateStr.substring(4, 6);
  const jour = dateStr.substring(6, 8);
  return `${annee}-${mois}-${jour}`;
}

function formatXAxis(tickItem: string) {
  const mois = ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", 
                "Juil.", "Août", "Sept.", "Octobre", "Novembre", "Décembre"];
  const date = new Date(tickItem);
  return mois[date.getMonth()];
}

function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

function App(): React.ReactElement {
  const [data, setData] = useState<TemperatureData[]>([]);
  const [selectedVille, setSelectedVille] = useState<string>('');
  const [villes, setVilles] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<FilteredTemp[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    fetch('/temp.csv')
      .then(response => response.text())
      .then(csvData => {
        const rows = csvData.split('\n').slice(1); // Ignorer l'en-tête
        const parsedData = rows
          .filter(row => row.trim() !== '') // Filtrer les lignes vides
          .map(row => {
            const [NUM_POSTE,NOM_USUEL,LAT,LON,ALTI,AAAAMMJJ,RR,QRR,TN,QTN,HTN,QHTN,TX,QTX,HTX,QHTX,TM,QTM,TNTXM,QTNTXM,TAMPLI,QTAMPLI,TNSOL,QTNSOL,TN50,QTN50,DG,QDG,FFM,QFFM,FF2M,QFF2M,FXY,QFXY,DXY,QDXY,HXY,QHXY,FXI,QFXI,DXI,QDXI,HXI,QHXI,FXI2,QFXI2,DXI2,QDXI2,HXI2,QHXI2,FXI3S,QFXI3S,DXI3S,QDXI3S,HXI3S,QHXI3S,DRR,QDRR] = row.split(';');
            // Vérifier si les données nécessaires sont présentes
            return {
              ville:NOM_USUEL,
              date: formatDate(AAAAMMJJ),
              tx: parseFloat(TX) || 0 ,
              tn: parseFloat(TN) || 0 ,
              tm: parseFloat(TM) || 0 // Utiliser 0 comme valeur par défaut si parseFloat échoue
            };
          })
          .filter((item): item is TemperatureData => item !== null); // Filtrer les éléments null

        console.log(parsedData);
        setData(parsedData);
        const uniqueVilles = Array.from(new Set(parsedData.map(item => item.ville)))
        .sort((a, b) => a.localeCompare(b, 'fr')); // Tri alphabétique avec priseen compte des accents
        setVilles(uniqueVilles);
        setSelectedVille(uniqueVilles[0]);
      });
  }, []);

  useEffect(() => {
    const filtered = data
      .filter(item => item.ville === selectedVille)
      .map(({ tx, tn, tm, date }) => ({ tx, tn, tm, date }));
    setFilteredData(filtered);
  }, [data, selectedVille]);

  const hcontainer = window.innerWidth < 768 ?  '300px' :  '600px'
  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-primary"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️ Mode clair' : '🌙 Mode sombre'}
            </button>
          </div>
          <div className="card">
            <div className="card-header">
              <h1 className="h4 mb-0">Températures par ville en Ardèche</h1>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <select 
                  value={selectedVille} 
                  onChange={(e) => setSelectedVille(e.target.value)}
                  className="form-select"
                >
                  {villes.map((ville) => (
                    <option key={ville} value={ville}>
                      {ville}
                    </option>
                  ))}
                </select>
              </div>

              <h2 className="h4 mb-4">Évolution des températures à {selectedVille}</h2>
              <div className="chart-container" style={{ width: '100%', height: hcontainer }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={filteredData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    style={{
                      backgroundColor: darkMode ? '#212529' : 'transparent'
                    }}
                  >
                    <ReferenceArea
                      y1={0}
                      y2={-50}
                      fill={darkMode ? "#dc354520" : "#0d6efd10"}
                      fillOpacity={1}
                    />
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={darkMode ? '#495057' : '#ccc'}
                    />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatXAxis}
                      interval="preserveStartEnd"
                      minTickGap={50}
                      stroke={darkMode ? '#dee2e6' : '#666'}
                    />
                    <YAxis 
                      unit="°C"
                      label={{ 
                        value: "T°C", 
                        angle: -90, 
                        position: 'insideLeft',
                        offset: -5,
                        style: { fill: darkMode ? '#dee2e6' : '#666' }
                      }}
                      stroke={darkMode ? '#dee2e6' : '#666'}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}°C`]}
                      contentStyle={{
                        fontWeight: 'bold'
                      }}
                      labelFormatter={(label: string) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        });
                      }}
                      labelStyle={{
                        color: '#000000'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      align="center"
                      layout="horizontal"
                      wrapperStyle={{
                        paddingTop: "20px"
                      }}
                      formatter={(value) => value.replace('Température', 'T°')}
                    />
                    <Area
                      type="monotone"
                      dataKey="tx"
                      stroke="#dc3545"
                      fill="#dc354520"
                      name="Température maximale"
                    />
                    <Area
                      type="monotone"
                      dataKey="tn"
                      stroke="#198754"
                      fill="#19875440"
                      name="Température minimale"
                    />
                    <Area
                      type="monotone"
                      dataKey="tm"
                      stroke="#0d6efd"
                      fill="#0d6efd20"
                      name="Température moyenne"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <small className="text-muted">
              Source : <a href="https://meteo.data.gouv.fr/datasets/donnees-climatologiques-de-base-quotidiennes/" 
                         target="_blank" 
                         rel="noopener noreferrer">
                Météo-France
              </a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 