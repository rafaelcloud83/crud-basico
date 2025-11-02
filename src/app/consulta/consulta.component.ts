import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-consulta',
  imports: [
    MatInputModule,
    MatCardModule,
    FlexLayoutModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit {

  nomeBusca: string = '';
  listaClientes: Cliente[] = [];
  colunasTabela: string[] = ['id', 'nome', 'cpf', 'email', 'dataNascimento', 'acoes'];
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(private service: ClienteService, private router: Router) {

  }

  ngOnInit(){
    this.listaClientes = this.service.pesquisarClientes('');
  }

  pesquisar(){
    this.listaClientes = this.service.pesquisarClientes(this.nomeBusca);
  }

  prepararEdicao(id: string){
    this.router.navigate(['/cadastro'], { queryParams: { 'id': id } });
  }

  prepararExclusao(cliente: Cliente){
    cliente.deletando = true;
  }

  deletar(cliente: Cliente){
    this.service.deletar(cliente);
    this.listaClientes = this.service.pesquisarClientes('');
    this.mostrarMensagem('Cliente deletado com sucesso!');
  }

  mostrarMensagem(msg: string) {
    this.snack.open(msg, 'OK', { duration: 3000 });
  }
}
