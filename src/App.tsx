// import { useState } from 'react'
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ThemeProvider } from "@/components/ui/theme-provider"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils"
import { CalendarIcon, Search } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';
import { Input } from "@/components/ui/input"

import './App.css'

const chartConfig = {
  temperature: {
    label: "T°C",
    color: "#E62BD9",
  },
  precipitation: {
    label: "Pluie",
    color: "#1916F5",
  },
  windspeed: {
    label: "Vent",
    color: "#379124",
  },
  gust: {
    label: "Rafales",
    color: "#14A39D",
  },
  snowfall: {
    label: "Neige",
    color: "#FFFFFF",
  }} satisfies ChartConfig

interface MeteoData {
  hourly: {
    time            : string[];
    temperature_2m	: number[];
    rain	          : number[];
    wind_speed_10m	: number[];
    cloud_cover	    : number[];
    wind_gusts_10m	: number[];
    snowfall        : number[];
  }
}

interface FilteredTemp {
  temperature   : number;
  precipitation : number;
  windspeed     : number;
  cloud         : number;
  gust          : number;
  snowfall      : number;
  date          : string;
}

interface Location {
  lat: string;
  lon: string;
  display_name: string;
}

// Créer une fonction utilitaire pour obtenir l'icône météo
const getWeatherIcon = (data: FilteredTemp) => {

  if (data.snowfall > 0) return '/weather/wi-snow.svg';
  if (data.precipitation > 0) return '/weather/wi-rain.svg';
  
  const date = new Date(data.date);
  const hour = date.getHours();
  
  if (hour >= 6 && hour < 21) {
    if (data.cloud < 10) return '/weather/wi-day-sunny.svg';
    if (data.cloud < 70) return '/weather/wi-day-cloudy.svg';
    return '/weather/wi-cloudy.svg';
  } else {
    if (data.cloud < 10) return '/weather/wi-night-clear.svg';
    if (data.cloud < 70) return '/weather/wi-night-cloudy.svg';
    return '/weather/wi-night-cloudy.svg';
  }
};

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as FilteredTemp;
    const date = new Date(label);
    
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.8)', 
        padding: '10px', 
        border: '1px solid #ccc',
        transform: 'translateY(-200px)'
      }}>
        <p style={{ textAlign: 'center' }}>{date.toLocaleDateString("fr-FR", {
          weekday: 'short',
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        }).replace(',', ' ')}</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <img 
            src={getWeatherIcon(data)}
            style={{
              width: '32px',
              height: 'auto',
              filter: 'invert(1)'
            }}
            alt="Weather Icon"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr 60px', gap: '5px', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: chartConfig.temperature.color, borderRadius: '30%' }}></div>
          <span style={{ textAlign: 'left' }}>T°C:</span>
          <span style={{ textAlign: 'right' }}>{data.temperature}°C</span>

          <div style={{ width: '12px', height: '12px', backgroundColor: chartConfig.windspeed.color, borderRadius: '30%' }}></div>
          <span style={{ textAlign: 'left' }}>Vent:</span>
          <span style={{ textAlign: 'right' }}>{data.windspeed} km/h</span>

          <div style={{ width: '12px', height: '12px', backgroundColor: chartConfig.gust.color, borderRadius: '30%' }}></div>
          <span style={{ textAlign: 'left' }}>Rafales:</span>
          <span style={{ textAlign: 'right' }}>{data.gust} km/h</span>

          <div style={{ width: '12px', height: '12px', backgroundColor: chartConfig.precipitation.color, borderRadius: '30%' }}></div>
          <span style={{ textAlign: 'left' }}>Pluie:</span>
          <span style={{ textAlign: 'right' }}>{data.precipitation} mm</span>

          <div style={{ width: '12px', height: '12px', backgroundColor: chartConfig.snowfall.color, borderRadius: '30%' }}></div>
          <span style={{ textAlign: 'left' }}>Neige:</span>
          <span style={{ textAlign: 'right' }}>{data.snowfall}  cm</span>
        </div>
      </div>
    );
  }
  return null;
};

function App() {
  const [data, setData] = useState<MeteoData | null>(null);
  const [filteredData, setFilteredData] = useState<FilteredTemp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [citySearch, setCitySearch] = useState<string>("");
  const [coordinates, setCoordinates] = useState({ latitude: "45.16", longitude: "4.80" });
  const [selectedCity, setSelectedCity] = useState<string>("");

  useEffect(() => {
    const jsonUrl = new URL("https://api.open-meteo.com/v1/forecast");
    jsonUrl.searchParams.append("latitude", coordinates.latitude);
    jsonUrl.searchParams.append("longitude", coordinates.longitude);
    jsonUrl.searchParams.append("hourly", "temperature_2m,snowfall,rain,cloud_cover,wind_speed_10m,wind_gusts_10m");
    jsonUrl.searchParams.append("timezone", "Europe/Paris");
    jsonUrl.searchParams.append("forecast_days", "7");
    jsonUrl.searchParams.append("models", "meteofrance_seamless");

    console.log("jsonUrl : ", jsonUrl.toString());

    fetch(jsonUrl.toString())
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData: MeteoData) => {
        if (!jsonData || !jsonData.hourly) {
          throw new Error('Les données reçues sont mal formatées');
        }

        setData(jsonData);
        setError(null);

        const times = jsonData.hourly.time.map(time => new Date(time));
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const minDate = new Date(Math.min(...times.map(date => date.getTime())));
        const maxDate = new Date(Math.max(...times.map(date => date.getTime())));

        setStartDate(times.some(date => date.toDateString() === today.toDateString()) ? today : minDate);
        setEndDate(times.some(date => date.toDateString() === tomorrow.toDateString()) ? tomorrow : maxDate);
      })
      .catch(error => {
        setError(
          `Erreur lors de la récupération des données météo: ${error.message}\n\n` +
          'Instructions de débogage:\n' +
          '1. Vérifiez votre connexion internet\n' +
          '2. Vérifiez que l\'API Open-Meteo est accessible\n' +
          '3. Vérifiez les coordonnées GPS utilisées\n' +
          '4. Consultez la console du navigateur pour plus de détails'
        );
        console.error('Erreur détaillée:', error);
      });
  }, [coordinates]);

  useEffect(() => {
    if (!data) return;

    const filtered = data.hourly.time.map((time, index) => {
      return {
        temperature   : Math.round(data.hourly.temperature_2m[index] * 10) / 10,
        cloud         : Math.round(data.hourly.cloud_cover[index]),
        precipitation : Math.round(data.hourly.rain[index] * 10) / 10,
        windspeed     : Math.round(data.hourly.wind_speed_10m[index] * 10) / 10,
        gust          : Math.round(data.hourly.wind_gusts_10m[index] * 10) / 10,
        snowfall      : Math.round(data.hourly.snowfall[index] * 10) / 10,
        date          : time
      };
    }).filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= startDate) && 
             (!endDate || itemDate <= endDate);
    });

    setFilteredData(filtered);
  }, [data, startDate, endDate]);

  const searchCity = async () => {
    if (!citySearch) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(citySearch)},france&limit=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );
      
      const data = await response.json() as Location[];
      
      if (data.length > 0) {
        setCoordinates({
          latitude  : data[0].lat,
          longitude : data[0].lon
        });
        setSelectedCity(data[0].display_name);
        setError(null);
      } else {
        setError("Ville non trouvée");
      }
    } catch (err) {
      setError("Erreur lors de la recherche de la ville");
      console.error("Erreur de recherche:", err);
    }
  };

  // console.log("precipitation : " + filteredData[0].precipitation);
  // console.log("cloud         : " + filteredData[0].cloud);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mt-4">
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div className="col-12">
            <Card style={{width:"80vw",margin:"0 auto",marginTop:"-100px"}}>
              <CardHeader>
                <CardTitle>Météo</CardTitle>

                {error ? (
                  <CardDescription style={{color: 'red', textAlign: 'center'}}>
                    {error}
                  </CardDescription>
                ) : (
                  <CardDescription style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                    {data && (
                      <>
                        Évolution de la température - vitesse du vent - précipitation
                      </>
                    )}
                  </CardDescription>
                )}

                <div style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px"
                }}>
                  <Input
                    type="text"
                    placeholder="Rechercher une ville..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchCity()}
                    style={{ maxWidth: "250px" }}
                  />
                  <Button onClick={searchCity} variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedCity && (
                  <CardDescription style={{
                    textAlign: "center",
                    marginTop: "5px"
                  }}>
                    {selectedCity}
                  </CardDescription>
                )}
                                
                <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {startDate ? startDate.toLocaleDateString("fr-FR", {
                              weekday : "short",
                              day     : "numeric",
                              month   : "short",
                            }).replace(',',' '): <span></span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={fr}
                      selected={startDate || new Date()}
                      onSelect={(date: Date | undefined) => setStartDate(date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {endDate ? endDate.toLocaleDateString("fr-FR", {
                              weekday : "short",
                              day     : "numeric",
                              month   : "short",
                            }).replace(',',' '): <span></span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      locale={fr}
                      selected={endDate || new Date()}
                      onSelect={(date: Date | undefined) => setEndDate(date || null)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>  

                </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', top: 0, right: 0, fontSize: '48px' }}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <img 
                          src={ filteredData.length > 0
                            ? getWeatherIcon(filteredData[0])
                            : '/weather/wi-cloudy.svg'
                          }
                          style={{
                            width: '128px',
                            height: 'auto',
                            filter: 'invert(1)'
                          }} 
                          alt="Weather Icon"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <h2 
                          className="text-5xl" 
                          style={{
                            marginTop: "-10px",
                            textShadow: `
                              -1px -1px 0 #fff,  
                               1px -1px 0 #fff,
                              -1px  1px 0 #fff,
                               1px  1px 0 #fff,
                              1px 1px 1px rgba(0,0,0,0.3)
                            `
                          }}
                        >
                          {filteredData.length > 0 && `${filteredData[0].temperature}°C`}
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
               
              </CardHeader>

              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">

                {!error && (
                  <div className="h-[250px]" >
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[200px] w-full"
                    >

                      <ComposedChart data={filteredData} height={350}>
                        <defs>
                          <linearGradient id="fillTemperature" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="1%"
                              stopColor="var(--color-temperature)"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--color-temperature)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>

                          <linearGradient id="fillPrecipitation" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="1%"
                              stopColor="var(--color-precipitation)"
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor="var(--color-precipitation)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>

                          <linearGradient id="fillWindspeed" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="1%"
                              stopColor="var(--color-windspeed)"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="2%"
                              stopColor="var(--color-windspeed)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient id="fillGust" x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="1%"
                              stopColor="var(--color-gust)"
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="2%"
                              stopColor="var(--color-gust)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("fr-FR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "numeric"
                            }).replace(',', ' ');
                          }}
                        />
                        <YAxis
                          yAxisId="temperature"
                          orientation="left"
                          tickFormatter={(value) => `${value}°C`}
                          stroke="var(--color-temperature)"
                        />
                        <YAxis
                          yAxisId="windspeed"
                          orientation="right"
                          tickFormatter={(value) => `${value} km/h`}
                          stroke="var(--color-windspeed)"
                        />
                        <YAxis
                          yAxisId="precipitation"
                          orientation="right"
                          tickFormatter={(value) => `${value} mm`}
                          stroke="var(--color-precipitation)"
                          hide={true}
                        />
                        <YAxis
                          yAxisId="snowfall"
                          orientation="right"
                          tickFormatter={(value) => `${value} mm`}
                          stroke="var(--color-snowfall)"
                          hide={true}
                        />
                        <Area
                          dataKey="temperature"
                          type="monotone"
                          fill="url(#fillTemperature)"
                          stroke="var(--color-temperature)"
                          strokeWidth={2}
                          yAxisId="temperature"
                        />
                        <Area
                          dataKey="gust"
                          type="monotone"
                          fill="url(#fillGust)"
                          stroke="var(--color-gust)"
                          strokeWidth={3}
                          yAxisId="windspeed"
                          unit="km/h"
                        />
                        <Area
                          dataKey="windspeed"
                          type="monotone"
                          fill="url(#fillWindspeed)"
                          stroke="var(--color-windspeed)"
                          strokeWidth={3}
                          yAxisId="windspeed"
                          unit="km/h"
                        />
                        <Bar
                          dataKey="precipitation"
                          fill="var(--color-precipitation)"
                          yAxisId="precipitation"
                          unit="mm"
                          stroke="var(--color-precipitation)"
                          strokeWidth={3}
                          radius={2}
                        />
                        <Bar
                          dataKey="snowfall"
                          fill="var(--color-snowfall)"
                          yAxisId="snowfall"
                          unit="cm"
                          stroke="var(--color-snowfall)"
                          strokeWidth={3}
                          radius={2}
                        />
                        <ChartTooltip content={<CustomTooltip />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </ComposedChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App
