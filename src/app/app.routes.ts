import { Routes } from '@angular/router';
import { HasieraComponent } from './hasiera/hasiera';
import { EguraldiaComponent } from './eguraldia/eguraldia';

export const routes: Routes = [
    { path: '', component: HasieraComponent },
    { path: 'eguraldia', component: EguraldiaComponent }
];