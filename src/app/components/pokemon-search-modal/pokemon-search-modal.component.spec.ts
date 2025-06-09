import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonSearchModalComponent } from './pokemon-search-modal.component';

describe('PokemonSearchModalComponent', () => {
  let component: PokemonSearchModalComponent;
  let fixture: ComponentFixture<PokemonSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PokemonSearchModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
