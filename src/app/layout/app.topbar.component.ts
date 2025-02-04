import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService} from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;
    

    constructor(public layoutService: LayoutService, private authService: AuthService,
        private router: Router,) { }
    
    onLogout() {
       this.authService.logout(); // Chama o método de logout do AuthService
       this.router.navigate(['/auth/login']); // Redireciona para a página de login
     }
}
