import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthGuard } from './pages/auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: AppLayoutComponent,
                    canActivate: [AuthGuard],
                    children: [
                        {
                            path: '',
                            loadChildren: () =>
                                import(
                                    './pages/dashboard/dashboard.module'
                                ).then((m) => m.DashboardModule),
                        },
                        {
                            path: 'emprestimos',
                            loadChildren: () =>
                                import(
                                    './pages/emprestimos/emprestimos.module'
                                ).then((m) => m.EmprestimoModule),
                        },
                        {
                            path: 'clientes',
                            loadChildren: () =>
                                import('./pages/clientes/clientes.module').then(
                                    (m) => m.ClientesModule,
                                ),
                        },
                        {
                            path: 'pages',
                            loadChildren: () =>
                                import(
                                    './demo/components/pages/pages.module'
                                ).then((m) => m.PagesModule),
                        },
                    ],
                },
                {
                    path: 'auth',
                    loadChildren: () =>
                        import('./pages/auth/auth.module').then(
                            (m) => m.AuthModule,
                        ),
                },
                {
                    path: 'landing',
                    loadChildren: () =>
                        import('./demo/components/landing/landing.module').then(
                            (m) => m.LandingModule,
                        ),
                },
                { path: 'notfound', component: NotfoundComponent },
                { path: '**', redirectTo: '/notfound' },
            ],
            {
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
                onSameUrlNavigation: 'reload',
            },
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
