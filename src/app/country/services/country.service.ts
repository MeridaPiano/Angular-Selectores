import { Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interfaces';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, of, tap } from 'rxjs';


@Injectable({providedIn: 'root'})
export class CountriesService {

  private baseURL: string = 'https://restcountries.com/v3.1';
  private _regions: Region[] = [ Region.Africa, Region.America, Region.Asia, Region.Europa, Region.Oceania ]

  constructor(
    private httpClient: HttpClient
  ) { }

  get regions(): Region[] {
    return [...this._regions ];
  }

  getCountriesByRegion( region: Region ): Observable<SmallCountry[]> {

    if( !region ) return of([]);

    const url: string = `${this.baseURL}/region/${region}?fields=cca3,name,borders`;
    return this.httpClient.get<Country[]>(url)
    .pipe(
      map( countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [],
        }))
      ),
      tap( response => console.log({ response }))
    )
  }

  getCountriesByAlphaCode( alphaCode: string ): Observable<SmallCountry> {

    // if( !region ) return of();

    const url: string = `${this.baseURL}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.httpClient.get<Country>(url)
    .pipe(
      map( country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? [],
        }))
      );
  }

  getCountryBordersByCode( borders: string[] ): Observable<SmallCountry[]> {
    if( !borders || borders.length === 0 ) return of([]);

    const countriesRequest:  Observable<SmallCountry>[] = [];

    borders.forEach( code => {
      const request = this.getCountriesByAlphaCode( code );
      countriesRequest.push( request );
    });

    return combineLatest( countriesRequest );
  }
}
