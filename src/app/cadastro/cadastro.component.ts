import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import {MatSnackBar} from '@angular/material/snack-bar';
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule, 
    MatCardModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    NgxMaskDirective
  ], providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit{

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService : BrasilapiService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (query: any) => {
      const params = query['params'];
      const id = params['id'];
      //console.log('Parâmetros recebidos: ', params);
      if(id){
        let clienteEncontrado = this.service.buscarClientePorId(id);
        if(clienteEncontrado){
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if(this.cliente.uf) {
            const event = { value: this.cliente.uf };
            this.carregarMunicipios(event as MatSelectChange);
          }
        }
      }
    });
    this.carregarEstados();
  }

  salvar() {
    if(!this.atualizando) {
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem('Cliente salvo com sucesso!');
    } else {
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostrarMensagem('Cliente atualizado com sucesso!');
    }
  }

  mostrarMensagem(msg: string) {
    this.snack.open(msg, 'OK', { duration: 3000 });
  }

  carregarEstados() {
    this.brasilApiService.listarEstados().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: err => console.error('Erro ao carregar estados: ', err)
    });
  }

  carregarMunicipios(event: MatSelectChange) {
    const ufSelecionado = event.value;
    this.brasilApiService.listarMunicipiosPorEstado(ufSelecionado).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: err => console.error('Erro ao carregar municípios: ', err)
    });
  }
}
