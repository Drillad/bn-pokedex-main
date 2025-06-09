import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterModule } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms'; // Import FormsModule


import { routes } from './app.routes'; 

import { AppComponent } from './app.component';
import { PokedexListComponent } from './pokedex-list/pokedex-list.component'; 
import { PokemonSearchModalComponent } from './components/pokemon-search-modal/pokemon-search-modal.component'; 

@NgModule({
  declarations: [
    AppComponent,
    PokedexListComponent, 
    PokemonSearchModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    RouterModule.forRoot(routes), // Add RouterModule and pass routes
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
