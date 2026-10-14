import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

declare var Chart: any;

@Component({
  selector: 'app-eguraldia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eguraldia.component.html',
  styleUrls: ['./eguraldia.css']
})
export class EguraldiaComponent implements OnInit, OnDestroy {
  txapaKlasea: string = 'bg-secondary';
  txapaTestua: string = 'Zain...';
  ordua: string = '-';
  botoiaDesgaituta: boolean = false;

  grafikoa: any = null;
  tenporizadorea: any;
  berritzeTartea = 10000;

  hiriburuak = [
    { izena: 'Bilbo', lat: 43.2627, lon: -2.9253, kolorea: 'rgba(255, 99, 132, 0.7)' },
    { izena: 'Donostia', lat: 43.3128, lon: -1.9750, kolorea: 'rgba(54, 162, 235, 0.7)' },
    { izena: 'Gasteiz', lat: 42.8463, lon: -2.6727, kolorea: 'rgba(75, 192, 192, 0.7)' },
    { izena: 'Iruñea', lat: 42.8169, lon: -1.6432, kolorea: 'rgba(255, 206, 86, 0.7)' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.hasieratuGrafikoa();
        this.kargatuDatuak();
        
        this.tenporizadorea = setInterval(() => {
          this.kargatuDatuak();
        }, this.berritzeTartea);
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.tenporizadorea) {
      clearInterval(this.tenporizadorea);
    }
  }

  hasieratuGrafikoa() {
    const canvas = document.getElementById('eguraldiGrafikoa') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    if (this.grafikoa) {
        this.grafikoa.destroy();
    }

    this.grafikoa = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.hiriburuak.map(h => h.izena),
        datasets: [{
          label: 'Tenperatura (ºC)',
          data: [0, 0, 0, 0], 
          backgroundColor: this.hiriburuak.map(h => h.kolorea),
          borderColor: this.hiriburuak.map(h => h.kolorea.replace('0.7', '1')),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Zentigradu (ºC)' }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  async kargatuDatuak() {
    this.txapaKlasea = 'bg-warning text-dark';
    this.txapaTestua = 'Kargatzen...';
    this.botoiaDesgaituta = true;

    try {
      const promesak = this.hiriburuak.map(async (hiria) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${hiria.lat}&longitude=${hiria.lon}&current_weather=true`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Sareko errorea API-a kargatzean');
        const data = await response.json();
        return data.current_weather.temperature; 
      });

      const emaitzak = await Promise.all(promesak);

      if (this.grafikoa) {
        this.grafikoa.data.datasets[0].data = emaitzak;
        this.grafikoa.update();
      }

      this.txapaKlasea = 'bg-success';
      this.txapaTestua = 'Eguneratuta';
      
      const orain = new Date();
      this.ordua = orain.toLocaleTimeString('eu-ES');
      
    } catch (error) {
      console.error("Errorea gertatu da:", error);
      this.txapaKlasea = 'bg-danger';
      this.txapaTestua = 'Errorea datuak lortzean';
    } finally {
      this.botoiaDesgaituta = false;
    }
  }
}