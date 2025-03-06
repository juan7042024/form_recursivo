import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, startWith, debounce, tap, switchMap, delay } from 'rxjs/operators';


interface Block{
  nombre: string;
}

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit{
  Buscador = new FormControl('');
  options: Block[] = [];
  // Opciones filtradas para el autocomplete
  filteredOptions!: Observable<Block[]>;
  
  selectedOption: Block | null = null;
  // Controla si se muestra el dropdown
  showDropdown = false;

   // Mensaje para mostrar "Buscando"
   loading: boolean = false;

  // Inyeccion del protocolo http
  constructor(private http: HttpClient){}

  // ngOnInit(): void {
  //   // se realiza una peticion al endpoint
  //   this.http.get<any>('http://localhost/servi.php').subscribe(response => {
  //     if (response.status === 'success') {
  //       // Nota: Usamos la clave "nombre"
  //       this.options = response.nombre.map((n: string) => ({ nombre:n})); // Convertimos a objeto esperado
        
  //        // Configuramos el filtrado: si el input está vacío, _filter devuelve un arreglo vacío
  //        this.filteredOptions = this.Buscador.valueChanges.pipe(
  //         startWith(''),
  //         debounce(value => timer((value && value.trim().length <= 1) ? 0 : 500)), // Retardo de 2 segundos
  //         switchMap(value => {
  //           // Si el input está vacío, no muestra opciones y desactiva loading
  //           if (!value || value.trim() === '') {
  //             this.loading = false;
  //             return of([]);
  //           }
  //           // Si hay texto, activa loading y filtra las opciones
  //           this.loading = true;
  //           const filtered = this._filter(value);
  //           // Luego de obtener los resultados, desactiva loading
  //           this.loading = false;
  //           return of(filtered);
  //         })
  //       );
  //     }
  //   });
  // }

  ngOnInit(): void {
    // Configuramos el filtrado adaptativo con consulta al servidor.
    this.filteredOptions = this.Buscador.valueChanges.pipe(
      startWith(''),
      // Si se escribe 1 letra, dispara la búsqueda de inmediato;
      // si se escriben más de 1, espera 2 segundos para afinar.
      debounce(value => timer((value && value.trim().length === 1) ? 0 : 2000)),
      tap(() => this.loading = true),
      switchMap(query => {
        if (!query || query.trim() === '') {
          this.loading = false;
          return of([]);
        }
        // Se hace la petición al endpoint enviando el query
        return this.http.get<any>(`http://localhost/servi.php?q=${query}`).pipe(
          map(response => {
            this.loading = false;
            if (response.status === 'success') {
              // Asumimos que el endpoint ya retorna los nombres filtrados
              return response.nombre.map((n: string) => ({ nombre: n }));
            }
            return [];
          })
        );
      })
    );
  }


// funcion de filtrado en base a la propiedad "name"
  // private _filter(value: string | null): Block[] {
  //   if (!value || value.trim() === '') {// Si no hay nada dentro del filtro
  //     return []; // No muestra nada si el input está vacío
  //   }
  //   const filterValue = (value ?? '').toLowerCase();
  //   return this.options.filter(option =>
  //     option.nombre.toLowerCase().includes(filterValue)
  //   );
  // }


  // Filtra las opciones basándose en el texto ingresado
  private _filter(value: string | null): Block[] {
    const filterValue = (value ?? '').toLowerCase();
    return this.options.filter(option =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

 // Alterna la visibilidad del dropdown
 toggleDropdown(): void {
  this.showDropdown = !this.showDropdown;
  if (this.showDropdown) {
    // Al abrir el dropdown, se limpia el input de búsqueda
    this.Buscador.setValue('');
  }
}

// Al seleccionar una opción, se asigna la opción y se cierra el dropdown
selectOption(option: Block): void {
  this.selectedOption = option;
  this.Buscador.setValue(option.nombre);
  this.showDropdown = false;
}

// Oculta el dropdown con un pequeño retardo para permitir el click en las opciones
onBlur(): void {
  setTimeout(() => this.showDropdown = false, 200);
}
}

