import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmprestimoComponent } from './emprestimos.component';
import { EmprestimoRoutingModule } from './emprestimos-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
    declarations: [EmprestimoComponent],
    imports: [
        CommonModule,
        EmprestimoRoutingModule,
        FormsModule,
        HttpClientModule,
        TableModule,
        ButtonModule,
        DialogModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        ToastModule,
        ToolbarModule,
    ],
})
export class EmprestimoModule {}
