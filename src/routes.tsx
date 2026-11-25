import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { PricingPage } from './pages/PricingPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { DemoPage } from './pages/DemoPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { SignupPage, LoginPage, ForgotPasswordPage, ResetPasswordPage } from './pages/AuthPages'
import { SecurityPage } from './pages/SecurityPage'
import { PrivacyPage, TermsPage } from './pages/LegalPages'
import { HelpPage } from './pages/HelpPage'
import { HelpArticlePage } from './pages/HelpArticlePage'
import { ThankYouPage } from './pages/ThankYouPage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * `handle.tone` controls the header: `dark` overlays a photographic hero,
 * `light` renders a solid header above plain page content.
 */
export const router = createBrowserRouter(
  [
    {
      path: '/',
      Component: Layout,
      children: [
        { index: true, Component: HomePage, handle: { tone: 'dark' } },
        { path: 'product', Component: ProductPage, handle: { tone: 'dark' } },
        { path: 'pricing', Component: PricingPage, handle: { tone: 'dark' } },
        { path: 'integrations', Component: IntegrationsPage, handle: { tone: 'dark' } },
        { path: 'demo', Component: DemoPage, handle: { tone: 'light' } },
        { path: 'about', Component: AboutPage, handle: { tone: 'dark' } },
        { path: 'contact', Component: ContactPage, handle: { tone: 'light' } },
        { path: 'signup', Component: SignupPage, handle: { tone: 'auth' } },
        { path: 'login', Component: LoginPage, handle: { tone: 'auth' } },
        { path: 'forgot-password', Component: ForgotPasswordPage, handle: { tone: 'auth' } },
        { path: 'reset-password', Component: ResetPasswordPage, handle: { tone: 'auth' } },
        { path: 'security', Component: SecurityPage, handle: { tone: 'dark' } },
        { path: 'privacy', Component: PrivacyPage, handle: { tone: 'light' } },
        { path: 'terms', Component: TermsPage, handle: { tone: 'light' } },
        { path: 'help', Component: HelpPage, handle: { tone: 'dark' } },
        { path: 'help/:slug', Component: HelpArticlePage, handle: { tone: 'light' } },
        { path: 'thank-you', Component: ThankYouPage, handle: { tone: 'light' } },
        { path: '404', Component: NotFoundPage, handle: { tone: 'light' } },
        { path: '*', Component: NotFoundPage, handle: { tone: 'light' } },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
