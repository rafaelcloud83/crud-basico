import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  static REPO_CLLIENTES = "_CLIENTES";

  constructor() { }

  salvar(cliente: Cliente) {
    console.log("Salvando cliente: ", cliente);
    const storage = this.obterStorage();
    storage.push(cliente);
    localStorage.setItem(ClienteService.REPO_CLLIENTES, JSON.stringify(storage));
  }

  pesquisarClientes(nome: string) : Cliente[] {
    return this.obterStorage();
  }

  private obterStorage(): Cliente[] {
    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLLIENTES);
    if (repositorioClientes) {
      const clientes: Cliente[] = JSON.parse(repositorioClientes);
      return clientes;
    }

    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLLIENTES, JSON.stringify(clientes));
    return clientes;
  }
}
