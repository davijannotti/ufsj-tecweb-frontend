import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes.component';
import { ClientesRoutingModule } from './clientes-routing.module';

// Importações do PrimeNG
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [ClientesComponent],
  imports: [
    CommonModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    CardModule,
    ClientesRoutingModule,
    ToastModule,
    ToolbarModule
  ],
})
export class ClientesModule {}
