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
// import { AdminProfileComponent } from './admin-profile/admin-profile.component';
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
  { path: 'home', component: HomeComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'brands/:brandName', component: BrandsComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'shop/:id', component: ShopDetailComponent },

  // Rutas que requieren autenticación de admin
  { path: 'add-news', component: AddNewsComponent, canActivate: [AdminGuard] },
  { path: 'add-watch', component: AddWatchComponent, canActivate: [AdminGuard] },
  { path: 'edit-watch/:id', component: EditWatchComponent, canActivate: [AdminGuard] },
  { path: 'edit-news/:id', component: EditNewsComponent, canActivate: [AdminGuard] },
  // { path: 'admin-profile', component: AdminProfileComponent, canActivate: [AdminGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },

  // Rutas comunes
  { path: 'profile', component: ProfileComponent, canActivate: [UserGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'insurance', component: InsuranceComponent },
  { path: 'sell-your-watch', component: SellYourWatchComponent, resolve:{isUser:isUserResolver}},
  { path: 'login', component: LoginComponent,canActivate: [NoAuthGuard] },
  { path: 'sign-up', component: SignUpComponent,canActivate: [NoAuthGuard] },
  { path: 'faq', component: FaqComponent },
  { path: 'no-access', component: NoAccessComponent },

  // Rutas del footer
  { path: 'about-us', component: AboutUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'policy-cookies', component: PolicyCookiesComponent },

  // Otras rutas
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },


];
