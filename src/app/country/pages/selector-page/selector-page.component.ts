import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['',  Validators.required ],
    country: ['',  Validators.required ],
    border: ['',  Validators.required ],
  })

  constructor (
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) { }

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('')),
      tap( () => this.borders = [] ),
      switchMap( region => this.countriesService.getCountriesByRegion(region))
    )
    .subscribe( countries => {
      this.countriesByRegion = countries
    });
  }

  onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get( 'border' )!.setValue('')),
      filter( ( value: string ) => value.length > 0 ),
      switchMap( ( alphaCode ) => this.countriesService.getCountriesByAlphaCode(alphaCode)),
      switchMap( ( country ) => this.countriesService.getCountryBordersByCode(country.borders))
    )
    .subscribe( countries => {
      this.borders = countries
    });
  }
}
