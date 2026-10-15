import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hasiera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hasiera.component.html'
})
export class HasieraComponent {
  bilaketaHiria: string = '';
  hiriaGordea: string = '';
  unekoDatuak: any = null;
  egunekoDatuak: any[] = [];

  constructor(private http: HttpClient) {}

  bilatuHiria() {
    if (!this.bilaketaHiria.trim()) return;
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${this.bilaketaHiria}&count=1&language=eu&format=json`;
    
    this.http.get<any>(geoUrl).subscribe({
      next: (geoData) => {
        if (geoData.results && geoData.results.length > 0) {
          const emaitza = geoData.results[0];
          this.hiriaGordea = emaitza.name.toUpperCase();
          this.lortuEguraldia(emaitza.latitude, emaitza.longitude);
        } else {
          alert('Ez da hiririk aurkitu!');
        }
      },
      error: (err) => console.error('Errorea geolokalizazioan', err)
    });
  }

  lortuEguraldia(lat: number, lon: number) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
    
    this.http.get<any>(weatherUrl).subscribe({
      next: (weatherData) => {
        this.unekoDatuak = weatherData.current;
        this.egunekoDatuak = [];
        for (let i = 0; i < weatherData.daily.time.length; i++) {
          this.egunekoDatuak.push({
            data: weatherData.daily.time[i],
            max: weatherData.daily.temperature_2m_max[i],
            min: weatherData.daily.temperature_2m_min[i],
            deskribapena: this.lortuEguraldiDeskribapena(weatherData.daily.weather_code[i])
          });
        }
      },
      error: (err) => console.error('Errorea eguraldia lortzean', err)
    });
  }

  lortuEguraldiDeskribapena(kodea: number): { testua: string, irudia: string } {
    switch (true) {
      case (kodea === 0): return { testua: 'Oskarbi', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXWet2h1u68wyBhxcgFPgIb6YB0_2hbH3mQtI4sdiXKQ&s=10' };
      case (kodea === 1 || kodea === 2 || kodea === 3): return { testua: 'Hodeitsu', irudia: 'https://static.vecteezy.com/system/resources/thumbnails/009/213/913/small_2x/cloud-with-sun-emoji-icon-cloudy-sunny-day-weather-symbol-illustration-vector.jpg' };
      case (kodea === 45 || kodea === 48): return { testua: 'Lainotsua', irudia: 'https://static.vecteezy.com/system/resources/previews/009/213/910/non_2x/clouds-emoji-icon-cloudy-day-weather-symbol-illustration-free-vector.jpg' };
      case (kodea >= 51 && kodea <= 57): return { testua: 'Zirimiria', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuhb0yQ6HzfV061DbKpHauwNTZzU6Ub4irM6KYI1fe6Vi1ZoIh6VDe0pto&s=10' };
      case (kodea >= 61 && kodea <= 67): return { testua: 'Euria', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuhb0yQ6HzfV061DbKpHauwNTZzU6Ub4irM6KYI1fe6Vi1ZoIh6VDe0pto&s=10' };
      case (kodea >= 71 && kodea <= 77): return { testua: 'Elurra', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9snnC9x58tvbgnk1_9dik_HlxC7MA5whopmDMFMwb_rswmnevqgZ__caL&s=10' };
      case (kodea >= 95): return { testua: 'Ekaitza', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ppSu8fN7nyrR_t5FiW166RfWvaGayWdqzvAFN4focw&s=10' };
      default: return { testua: 'Ezezaguna', irudia: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9RCzgo-9ut_1JMOfA28VbyQIbRrmDLXOuM0oAuaaiDw&s=10' };
    }
  }
}