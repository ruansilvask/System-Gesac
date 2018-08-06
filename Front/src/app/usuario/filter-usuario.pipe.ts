import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterUsuario'
})
export class FilterUsuarioPipe implements PipeTransform {
  valida: boolean;
  transform(usuarios: any, status: any, nome: any, login: any, email: any): any {
    if (!status && !nome && !login && !email) {
      return usuarios;
    }
    return usuarios.filter(usuario => {
      this.valida = true;
      if (status && status.toLowerCase() !== 'status' && (usuario.statusII.toLowerCase() !== status.toLowerCase())) {this.valida = false; }
      if (nome && !usuario.nome.toLowerCase().includes(nome.toLowerCase())) {this.valida = false; }
      if (login && !usuario.login.toString().includes(login.toLowerCase())) {this.valida = false; }
      if (email && !usuario.email.toString().includes(email.toLowerCase())) {this.valida = false; }
      return this.valida;
      });
  }

}
