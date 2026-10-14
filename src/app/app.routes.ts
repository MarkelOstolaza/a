import { Routes } from '@angular/router';
import { HasieraComponent } from './hasiera/hasiera.component';
import { EguraldiaComponent } from './eguraldia/eguraldia.component';

export const routes: Routes = [
    { path: '', component: HasieraComponent }, // Hasiera orria automatikoki
    { path: 'eguraldia', component: EguraldiaComponent } // Eguraldiaren menua
];