import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { LoginRequest } from '../Models/LoginRequest';
import { UserData } from '../Models/UserData';
import { Employee } from '../Models/Employee';
import { WareHouse } from '../Models/WareHouse';
import { Product } from '../Models/Product';
import { WarehouseInfo } from '../Models/WarehouseInfo';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

 
  baseApiUrl: string = "https://localhost:7022/api/Home";



  updateProduct(product: any): Observable<any> {
    console.log(product);
    return this.http.post(`${this.baseApiUrl}/EditProduct`, product);
}
  constructor(private http: HttpClient) { }
  
  private getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  removeProduct(barcode: string, quantity: number): Observable<any> {
    const userId = this.getUserId();

    if (userId) {
      const body = { userId: Number(userId), barcode, quantity };
      console.log(body);
      return this.http.post<any>(`${this.baseApiUrl}/RemoveProduct`, body)
        .pipe(catchError(err => {
          console.error('Error occurred:', err);
          return throwError(err);
        }));
    } else {
      console.error('User ID is not available in localStorage.');
      return throwError('User ID is required'); 
    }
  }

  DeleteEmployeeAsync(userId: number): Observable<void> {
    console.log(userId)
    return this.http.post<void>(`${this.baseApiUrl}/DeleteUser`, userId);
  }

  UpdateEmployeeAsync(employee: any): Observable<void> {
    console.log(employee);
    return this.http.post<void>(`${this.baseApiUrl}/UpdateUserByPersonId`, employee);
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Login`, request).pipe(
      map((response: any) => {
        if (response && response.token) {
          const token = response.token;
          const role = response.role;
          const userId = response.userId;

          localStorage.setItem('token', token);
        //  localStorage.setItem('role', role);
          localStorage.setItem('userId', userId.toString());

          return response;
        } else {
          console.error('Login response is missing token');
          throw new Error('Login response is missing token');
        }
      })
    );
  }

  updateUserStatus(userId: number, status: number): Observable<any> {
    console.log(userId, status);
    return this.http.post(`${this.baseApiUrl}/UpdateUserStatus`, { userId, status }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError('An error occurred while updating user status. Please try again later.');
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  register(formData: UserData): Observable<any> {
    console.log(formData);
    return this.http.post<any>(`${this.baseApiUrl}/CreateUser`, formData);
  }

  GetAllProjectUsersAsync(): Observable<any> {
    const token = this.getToken(); 
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}` 
    });
    return this.http.get<any>(`${this.baseApiUrl}/GetAllProjectUsersAsync`, { headers });
  }

  getEmployees(): Observable<Employee[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}`
    });
    return this.http.get<Employee[]>(`${this.baseApiUrl}/GetEmployees`, { headers });
  }

  FetchProducts(): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/FetchProducts`);
  }

  GetRemovedProducts(): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/GetRemovedProducts`);
  }

  GetRemovedProductsByUserId(userId: number): Observable<WareHouse[]> {
    return this.http.post<WareHouse[]>(`${this.baseApiUrl}/GetRemovedProductsByUserId`, userId);
  }

  FetchProductbyuserId(userId: number): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/FetchProductbyuserId/${userId}`).pipe(
      catchError((error) => {
        if (error.status !== 404) {
          console.error('Error fetching data from API', error);
        }
        return of([]); 
      })
    );
  }

  addProduct(product: Product): Observable<any> {
    console.log(product);
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}`,  
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.baseApiUrl}/AddProduct`, product, { headers });
  }

  getAllProjectUsersWithStatus(): Observable<any> {
    return this.http.get('/api/GetAllProjectUsersWithStatus');
  }

  getAllOrganizationNames(): Observable<string[]> {
    const token = this.getToken(); 
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}`,  
      'Content-Type': 'application/json'
    });

    return this.http.get<string[]>(`${this.baseApiUrl}/GetAllOrganizationNamesAsync`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching organization names:', error);
        return throwError(() => new Error('Failed to fetch organization names. Please try again later.'));
      })
    );
  }


  checkFreeSeatsByUserId(userId: number): Observable<WarehouseInfo[]> {
    const url = `${this.baseApiUrl}/check-free-seats/${userId}`;
    return this.http.get<WarehouseInfo[]>(url);
  }

  checkFreeSeatsAllWarehouses(): Observable<WarehouseInfo[]> {
    const url = `${this.baseApiUrl}/check-free-seats`;
    return this.http.get<WarehouseInfo[]>(url);
  }

  FetchNameAndLocation(): Observable<any> {
    console.log("fetchNameAndLocation");
    const url = `${this.baseApiUrl}/FetchNameAndLocation`;
    return this.http.get<any>(url); 
  }


  addWarehouse(warehouseData: WarehouseInfo): Observable<any> {
    const url = `${this.baseApiUrl}/AddWarehouse`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    console.log(warehouseData)
    return this.http.post(url, warehouseData, { headers });
  }
  
 
}
