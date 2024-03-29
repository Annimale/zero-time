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
import { ShoppingBagComponent } from './shopping-bag/shopping-bag.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PolicyCookiesComponent } from './policy-cookies/policy-cookies.component';

export const routes: Routes = [
    // NAVBAR
    { path: 'home', component: HomeComponent },
    { path: 'news', component: NewsComponent },
    { path: 'news-detail', component: NewsDetailComponent },//El title lo sacamos de la DB de la news, DE MOMENTO PROVISIONAL LO DE NEWS-DETAIL
  //{ path: 'news/:title', component: NewsDetailComponent },//El title lo sacamos de la DB de la news, DE MOMENTO PROVISIONAL LO DE NEWS-DETAIL
    { path: 'brands', component: BrandsComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shop/:model', component: ShopComponent },//El model lo sacamos de la DB del watch
    { path: 'add-news', component: AddNewsComponent },
    { path: 'add-watch', component: AddWatchComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'shopping-bag', component: ShoppingBagComponent },
    { path: 'insurance', component: InsuranceComponent },
    { path: 'sell-your-watch', component: SellYourWatchComponent },

    // FOOTER
    { path: 'about-us', component: AboutUsComponent },
    { path: 'privacy-policy', component: PrivacyPolicyComponent },
    { path: 'terms-conditions', component: TermsConditionsComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'policy-cookies', component: PolicyCookiesComponent },


    // OTHERS
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },


];
