import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contracts, MaintenanceContract, Website } from '../../types/Website';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class UserWebsitesService {
  website: WritableSignal<Website[]> = signal([]);
  contract: WritableSignal<Contracts[]> = signal([]);
  maintenanceContract: WritableSignal<MaintenanceContract[]> = signal([]);
  allInformations: WritableSignal<Website[]> = signal([]);

  constructor(private http: HttpClient) {}

  /**
   * Récupère tout les sites webs de l'utilisateur courrant
   */
  fetchWebsites(): Observable<Website[]> {
    return this.http.get<Website[]>(`${environment.SERVER_URL}/api/user/website`);
  }

  fetchWebsitesContract(): Observable<Contracts[]> {
    return this.http.get<Contracts[]>(`${environment.SERVER_URL}/api/user/website/contract/me`);
  }

  fetchWebsitesMaintenanceContract(): Observable<MaintenanceContract[]> {
    return this.http.get<MaintenanceContract[]>(
      `${environment.SERVER_URL}/api/user/maintenance/contract/me`
    );
  }

  fetchAllInformations() {
    return this.http.get<Website[]>(`${environment.SERVER_URL}/api/user/website/contract/get/all`);
  }

  refreshWebsites(): Observable<Website[]> {
    return this.fetchWebsites().pipe(
      tap(websites => {
        this.website.set(websites);
      })
    );
  }

  refreshContract(): Observable<Contracts[]> {
    return this.fetchWebsitesContract().pipe(
      tap(contract => {
        this.contract.set(contract);
      })
    );
  }
  refreshMaintenanceContract(): Observable<MaintenanceContract[]> {
    return this.fetchWebsitesMaintenanceContract().pipe(
      tap(contract => {
        this.maintenanceContract.set(contract);
      })
    );
  }

  refreshWebsiteAllInformations(): Observable<Website[]> {
    return this.fetchAllInformations().pipe(
      tap(informations => {
        this.allInformations.set(informations);
      })
    );
  }

  getInformationWebsiteByEmail(uuid: string): Observable<object> {
    return this.http.get<object>(
      `${environment.SERVER_URL}/api/user/website/configuration/${uuid}`
    );
  }
}
