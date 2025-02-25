import { Component, OnInit } from '@angular/core';
import { BloquesService } from './bloques.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // Declaraciones de los arreglos
  bloques: any[] = [];
  formData: any = {};  // Objeto para almacenar los datos del formulario

  displayMode: string = 'columns';
  currentPage: number = 0;

  // Inyeccion de bloques.service.ts
  constructor(private bloquesService: BloquesService) { }

  // Accion donde se cargaran los bloques
  ngOnInit(): void {
    this.bloquesService.obtenerBloques().subscribe(
      
      (response) => {
        console.log('Respuesta de la API:', response); // Verifica si la respuesta es correcta en la consola
        if (response.status === 'success') {
          this.bloques = response.blocks;
          this.displayMode = response.display_mode || 'columns';
          this.currentPage = 0;

        } else {
          console.error('Error al cargar los bloques');
        }
      },
      (error) => {
        console.error('Error al obtener los datos del servidor', error);
      }
    );
  }

  onSubmit(formData: any) {
    console.log('Formulario enviado:', formData);
  }
}
