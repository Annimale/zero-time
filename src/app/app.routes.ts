import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsComponent } from './news/news.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { ShopComponent } from './shop/shop.component';
import { BrandsComponent } from './brands/brands.component';
import { SellYourWatchComponent } from './sell-your-watch/sell-your-watch.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { AddWatchComponent } from './add-watch/add-watch.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PolicyCookiesComponent } from './policy-cookies/policy-cookies.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CartComponent } from './cart/cart.component';
import { FaqComponent } from './faq/faq.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { EditWatchComponent } from './edit-watch/edit-watch.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { NoAccessComponent } from './no-access/no-access.component';
import { AdminGuard } from './admin-guard.guard';
import { UserGuard } from './user-guard.guard';
import { isUserResolver } from './is-user.resolver';
import { NoAuthGuard } from './noauth.service';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  // Rutas comunes
  { path: 'home', component: HomeComponent,title:'Zero Time - Home' },
  { path: 'news', component: NewsComponent,title:'Zero Time - News' },
  { path: 'news/:id', component: NewsDetailComponent,title:'Zero Time - News' },
  { path: 'brands/:brandName', component: BrandsComponent,title:'Zero Time - Brands' },
  { path: 'shop', component: ShopComponent,title:'Zero Time - Shop' },
  { path: 'shop/:id', component: ShopDetailComponent,title:'Zero Time - Shop' },

  // Rutas que requieren autenticación de admin
  { path: 'add-news', component: AddNewsComponent, canActivate: [AdminGuard],title:'Zero Time - Add news' },
  { path: 'add-watch', component: AddWatchComponent, canActivate: [AdminGuard],title:'Zero Time - Add watch' },
  { path: 'edit-watch/:id', component: EditWatchComponent, canActivate: [AdminGuard],title:'Zero Time - Edit watch' },
  { path: 'edit-news/:id', component: EditNewsComponent, canActivate: [AdminGuard],title:'Zero Time - Edit news' },
  // { path: 'admin-profile', component: AdminProfileComponent, canActivate: [AdminGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard],title:'Zero Time - Users' },

  // Rutas comunes
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard],title:'Zero Time - Profile' },
  { path: 'cart', component: CartComponent,resolve:{isUser:isUserResolver},title:'Zero Time - Cart' },
  { path: 'insurance', component: InsuranceComponent,title:'Zero Time - Insurance' },
  { path: 'sell-your-watch', component: SellYourWatchComponent, resolve:{isUser:isUserResolver},title:'Zero Time - Sell your watch'},
  { path: 'login', component: LoginComponent,canActivate: [NoAuthGuard],title:'Zero Time - Login' },
  { path: 'sign-up', component: SignUpComponent,canActivate: [NoAuthGuard] ,title:'Zero Time - Sign up'},
  { path: 'faq', component: FaqComponent,title:'Zero Time - FAQ' },
  { path: 'no-access', component: NoAccessComponent ,title:'Zero Time - No access'},

  // Rutas del footer
  { path: 'about-us', component: AboutUsComponent,title:'Zero Time - About us' },
  { path: 'privacy-policy', component: PrivacyPolicyComponent,title:'Zero Time - Privacy policy' },
  { path: 'terms-conditions', component: TermsConditionsComponent ,title:'Zero Time - Terms and conditions'},
  { path: 'contact-us', component: ContactUsComponent,title:'Zero Time - Contact us' },
  { path: 'policy-cookies', component: PolicyCookiesComponent,title:'Zero Time - Cookies policy' },

  // Otras rutas
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },


];
