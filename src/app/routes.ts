import {RouterModule,Routes} from '@angular/router';
import { AgentesExternosComponent } from './agentes-externos/agentes-externos.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { LoginVerifyGuard } from './login-verify.guard';
import { CommonLayoutComponent } from './common/common-layout.component';
import { CupoComponent } from './cupo/cupo.component';

const appRoutes:Routes =[

    {
        path: 'main', component: CommonLayoutComponent,   canActivateChild: [AuthGuard],
        children: [{ path: '', component: AgentesExternosComponent, }]
    },
    {
        path: 'cupo', component: CommonLayoutComponent,   canActivateChild: [AuthGuard],
        children: [{ path: '', component: CupoComponent, }]
    },
   // {
       /*  path: 'login', component: LoginComponent, */
        /* children: [{ path: '', component: LoginComponent, canActivate: [AuthGuard] }] */
   //     path:'login', component:LoginComponent ,canActivate: [AuthGuard], 
   // },



    {path:'login', component:LoginComponent, canActivate : [LoginVerifyGuard]},
  
    {path:'',redirectTo:'/login',pathMatch:'full'}, 
    {path:'**',redirectTo:'/login',pathMatch:'full'},
]

export const APP_ROUTES = RouterModule.forRoot(appRoutes);