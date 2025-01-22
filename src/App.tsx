// import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
  ChartTooltipContent,
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
import { CalendarIcon } from "lucide-react"
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale';

import './App.css'

const chartConfig = {
  temperature: {
    label: "T°C",
    color: "#E62BD9",
  },
  precipitation: {
    label: "Pluie",
    color: "#2662D9",
  },
  windspeed: {
    label: "Vent",
    color: "#379124",
  }
} satisfies ChartConfig

interface MeteoData {
  metadata: {
    latitude: number;
    longitude: number;
  };
  units: {
    temperature: string;
  };
  data_1h: {
    time: string[];
    temperature: number[];
    precipitation: number[];
    windspeed: number[];
  }
}

interface FilteredTemp {
  temperature: number;
  precipitation: number;
  windspeed: number;
  date: string;
}

function App() {
  const [data, setData] = useState<MeteoData | null>(null);
  const [filteredData, setFilteredData] = useState<FilteredTemp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const jsonUrl = `${window.location.origin}/basic-1h_basic-day.customization`;
    // console.log('Tentative de chargement du JSON depuis:', jsonUrl);

    fetch(jsonUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })
      .then(response => {
        // console.log('Status de la réponse:', response.status);
        // console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Le fichier meteo.json est introuvable. Vérifiez qu\'il existe dans le dossier public/');
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        return response.text().then(text => {
          // console.log('Contenu reçu:', text.substring(0, 200) + '...'); // Log des premiers caractères
          try {
            return JSON.parse(text);
          } catch (e) {
            // console.error('Erreur de parsing JSON:', e);
            throw new Error(
              'Le fichier n\'est pas un JSON valide. ' +
              'Vérifiez que le fichier meteo.json est bien placé dans le dossier public/ ' +
              'et qu\'il contient un JSON valide.'
            );
          }
        });
      })
      .then((jsonData: MeteoData) => {
        // console.log('Données météo chargées:', jsonData);
        
        if (!jsonData || typeof jsonData !== 'object') {
          throw new Error('Le fichier JSON est vide ou mal formaté');
        }
        
        if (!jsonData.metadata || 
            typeof jsonData.metadata.latitude !== 'number' || 
            typeof jsonData.metadata.longitude !== 'number') {
          throw new Error('Les métadonnées (latitude/longitude) sont manquantes ou invalides');
        }
        
        if (!jsonData.units || typeof jsonData.units.temperature !== 'string') {
          throw new Error('Les unités de température sont manquantes ou invalides');
        }
        
        if (!jsonData.data_1h || 
            !Array.isArray(jsonData.data_1h.time) || 
            !Array.isArray(jsonData.data_1h.temperature) ||
            jsonData.data_1h.time.length !== jsonData.data_1h.temperature.length) {
          throw new Error(
            'Les données horaires sont manquantes ou invalides. ' +
            'Vérifiez le format du fichier JSON.'
          );
        }

        setData(jsonData);
        setError(null);

        // Initialiser startDate et endDate
        const times = jsonData.data_1h.time.map(time => new Date(time));
        setStartDate(new Date(Math.min(...times.map(date => date.getTime()))));
        setEndDate(new Date(Math.max(...times.map(date => date.getTime()))));
      })
      .catch(error => {
        // console.error('Erreur lors du chargement des données:', error);
        setError(
          `Erreur: ${error.message}\n\n` +
          'Instructions de débogage:\n' +
          '1. Vérifiez que le fichier meteo.json existe dans le dossier public/\n' +
          '2. Vérifiez que le contenu du fichier est un JSON valide\n' +
          '3. Essayez d\'accéder directement au fichier via le navigateur: /meteo.json\n' +
          '4. Redémarrez le serveur de développement\n' +
          '5. Vérifiez la // console du navigateur pour plus de détails'
        );
      });
  }, []);

  useEffect(() => {
    if (!data) return;

    const filtered = data.data_1h.time.map((time, index) => {
      return {
        temperature   : data.data_1h.temperature[index],
        precipitation : data.data_1h.precipitation[index],
        windspeed     : data.data_1h.windspeed[index]*3.6,
        date          : time
      };
    }).filter(item => {
      const itemDate = new Date(item.date);
      return (!startDate || itemDate >= startDate) && 
             (!endDate || itemDate <= endDate);
    });

    setFilteredData(filtered);
  }, [data, startDate, endDate]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="container mt-4">
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <div className="col-12">
            <Card style={{width:"80vw",margin:"0 auto"}}>
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
                              weekday: "short",
                              day: "numeric",
                              month: "short",
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
                              weekday: "short",
                              day: "numeric",
                              month: "short",
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
              </CardHeader>

              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {!error && (
                  <div className="h-[400px]">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[250px] w-full"
                    >
                      <AreaChart data={filteredData}>
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
                            }).replace(',',' ');
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
                        <Area
                          dataKey="temperature"
                          type="monotone"
                          fill="url(#fillTemperature)"
                          stroke="var(--color-temperature)"
                          yAxisId="temperature"
                        />
                        <Area
                          dataKey="windspeed"
                          type="monotone"
                          fill="url(#fillWindspeed)"
                          stroke="var(--color-windspeed)"
                          yAxisId="windspeed"
                          unit="km/h"
                        />
                        <Area
                          dataKey="precipitation"
                          type="monotone"
                          fill="url(#fillPrecipitation)"
                          stroke="var(--color-precipitation)"
                          yAxisId="temperature"
                          unit="mm"
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value: string) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("fr-FR", {
                                  weekday: 'short',
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "numeric"
                                }).replace(',',' ');
                              }}
                            />
                          }
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>s
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App
