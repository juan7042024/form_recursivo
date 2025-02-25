import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bloque',
  templateUrl: './bloque.component.html',
  styleUrls: ['./bloque.component.css']
})
export class BloqueComponent implements OnChanges {
  @Input() bloque: any;
  @Input() formData: any = {};  // Datos del formulario

  displayMode: string = 'columns'; // se pone por defecto
  //groupSize: number = 3;
  //pages: number[] = [];
  groups: any[] = []; // Aquí se almacenarán los grupos para mostrar (cada grupo es un objeto con, por ejemplo, title y blocks)
  currentPage: number = 0;

  // Lista de modos válidos (puedes agregar más si es necesario)
  private validDisplayModes = ['columns', 'pagination', 'tabs'];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bloque']) {
      // this.displayMode = this.bloque.display_mode || 'columns';
      // //this.groupSize = this.bloque.group_size || 3;
      // this.currentPage = 0;

      // Primero, se recorre la estructura y se asigna 'columns' donde haga falta
      this.bloque = this.assignDisplayModeRecursively(this.bloque);
      // Se asigna el display_mode del bloque padre
      this.displayMode = this.bloque.display_mode;
      this.currentPage = 0;
      


      if (this.bloque.blocks) {
        // Si los bloques ya están agrupados (es decir, cada objeto tiene su propiedad "blocks")
        if (
          this.bloque.blocks.length &&
          typeof this.bloque.blocks[0] === 'object' &&
          this.bloque.blocks[0].blocks !== undefined
        ) {
          this.groups = this.bloque.blocks.map((grupo: any, index: number) => {
            // Si no se ha definido un título, se asigna un valor por defecto
            if (!grupo.title) {
              grupo.title = 'Grupo ' + (index + 1);
            }
            return grupo;
          });
        } else {
          // Si los bloques no están agrupados, se agrupan todos en un único grupo
          this.groups = [{
            title: this.bloque.title || 'Grupo 1',
            blocks: this.bloque.blocks
          }];
        }
      } else {
        this.groups = [];
      }
      
    }
  }

   /**
   * Función recursiva que recorre cada bloque (padre e hijos) y verifica si se declaró un display_mode.
   * Si no se encuentra o no es válido, se asigna 'columns' por defecto.
   */
   private assignDisplayModeRecursively(block: any): any {
    if (block) {
      // Si el objeto (ya sea padre o hijo) no tiene 'display_mode'
      // o no es una cadena válida según nuestros modos válidos, se asigna 'columns'
      if (
        !block.hasOwnProperty('display_mode') ||
        typeof block.display_mode !== 'string' ||
        !this.validDisplayModes.includes(block.display_mode.toLowerCase())
      ) {
        block.display_mode = 'columns';
      } else {
        block.display_mode = block.display_mode.toLowerCase();
      }
  
      // Si existen bloques anidados, se procesa cada uno de forma recursiva
      if (block.blocks && Array.isArray(block.blocks)) {
        block.blocks = block.blocks.map((child: any) =>
          this.assignDisplayModeRecursively(child)
        );
      }
    }
    return block;
  }
  
  // Método para manejar el envío del formulario (recursivo)
  onSubmit(formData: any) {
    console.log('Formulario enviado:', formData);
  }
}
