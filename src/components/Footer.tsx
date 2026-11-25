import { Link } from 'react-router'
import { DEMO_DISCLOSURE, FOOTER_COLUMNS, IMAGES } from '@/content/site'
import { ArborLogo, BotanicalBackdrop, ButtonLink } from './ui'

export function Footer() {
  return (
    <footer className="px-3 pb-4 pt-8 sm:px-5 sm:pb-6">
      <BotanicalBackdrop
        src={IMAGES.footer}
        overlayClassName="bg-gradient-to-b from-night/80 via-[#101F13]/85 to-[#0B160D]/92"
        className="mx-auto max-w-[1260px] rounded-[28px] text-white"
      >
        <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="mx-auto max-w-[640px] py-20 text-center sm:py-24">
            <h2 className="text-balance text-[34px] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[46px]">
              Ready to build better customer relationships?
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[15.5px] leading-relaxed text-on-dark-muted">
              Create a workspace, or walk through Arbor with someone from our team first.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink to="/signup" variant="light" size="lg" arrow>
                Get started
              </ButtonLink>
              <ButtonLink to="/demo" variant="glass" size="lg">
                Book a demo
              </ButtonLink>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 border-t border-white/10 py-14 md:grid-cols-6">
            <div className="col-span-2">
              <Link to="/" aria-label="Arbor home" className="inline-block rounded-lg">
                <ArborLogo light />
              </Link>
              <p className="mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-on-dark-soft">
                A calm, focused CRM for teams who care about every customer relationship.
              </p>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3.5 text-[13.5px] font-medium text-white">{col.title}</h3>
                <ul className="space-y-2.5 text-[13.5px]">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-on-dark-soft transition-colors duration-[150ms] ease-[var(--ease-out)] hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-[12.5px] text-on-dark-subtle md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Arbor. All rights reserved.</span>
            <p className="max-w-[640px] md:text-right">{DEMO_DISCLOSURE}</p>
          </div>
        </div>
      </BotanicalBackdrop>
    </footer>
  )
}
