import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Phone, Instagram, Facebook, MapPin, MessageCircle } from 'lucide-react';
import { company, waLink } from '../lib/config';

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 min-w-0">
      <img src="/images/company-logo.png" alt="Maha Laxshmi Builders logo" className={`${small ? 'h-12 w-12' : 'h-12 w-12 md:h-14 md:w-14'} object-contain rounded-full`} />
      <div className="leading-tight min-w-0">
        <div className="text-xs md:text-sm font-extrabold tracking-[.12em] text-[#253b2d] truncate">MAHA LAXSHMI</div>
        <div className="text-[.58rem] md:text-[.64rem] text-[#9b7b42] tracking-[.14em] mt-1 truncate">BUILDERS & PRIVATE LIMITED</div>
      </div>
    </Link>
  );
}

const links = [['/', 'Home'], ['/about', 'About'], ['/properties', 'Properties'], ['/contact', 'Contact']] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed z-50 w-full transition-all duration-300 ${scrolled || open ? 'bg-white/95 backdrop-blur-xl border-b border-[#e3e8df] shadow-sm' : 'bg-white/95 backdrop-blur-xl border-b border-[#e3e8df]'}`}>
      <div className="container-x flex h-20 md:h-24 items-center justify-between gap-4">
        <Brand />
        <nav aria-label="Main navigation" className="hidden lg:flex gap-9 items-center">
          {links.map(([to, title]) => (
            <NavLink end={to === '/'} key={to} to={to} className={({ isActive }) => `text-[.76rem] uppercase font-semibold tracking-[.13em] transition ${isActive ? 'text-[#a5834b]' : 'text-[#43584a] hover:text-[#a5834b]'}`}>
              {title}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`tel:+91${company.phone}`} aria-label="Call Maha Laxshmi Builders" className="hidden md:inline-flex text-[#9b7b42] border border-[#d9d5c8] p-3"><Phone size={17} /></a>
          <a href={waLink('Hello Maha Laxshmi Builders, I would like to know more about available plots.')} target="_blank" rel="noopener noreferrer" className="hidden lg:inline-flex text-[#9b7b42] border border-[#d9d5c8] p-3" aria-label="WhatsApp Maha Laxshmi Builders"><MessageCircle size={17} /></a>
          <Link to="/contact" className="gold-btn hidden lg:inline-flex">Enquire Now <ArrowUpRight size={16} /></Link>
          <button className="lg:hidden p-3 text-[#2d4934] border border-[#d9d5c8]" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile navigation" className="lg:hidden bg-white border-t border-[#e7e8e1] px-6 pb-6 pt-3">
          {links.map(([to, title]) => <Link to={to} className="block py-4 border-b border-[#e7e8e1] text-[#2f4534] text-sm uppercase tracking-widest" key={to}>{title}</Link>)}
          <Link to="/contact" className="gold-btn mt-6 w-full">Enquire Now</Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#f4f6f0] border-t border-[#e2e8dd]">
      <div className="container-x py-16 grid gap-10 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <Brand />
          <p className="text-[#68796b] text-sm leading-7 max-w-sm mt-5">Explore residential plot opportunities in and around Nabarangpur, Odisha. Speak with the team for updated details, pricing discussion and a guided site visit.</p>
        </div>
        <div>
          <div className="eyebrow mb-5">Quick Links</div>
          <div className="space-y-3">{links.map(([to, title]) => <Link key={to} to={to} className="block text-[#526655] hover:text-[#9b7b42] text-sm">{title}</Link>)}</div>
        </div>
        <div>
          <div className="eyebrow mb-5">Get In Touch</div>
          <p className="flex items-start gap-3 text-sm text-[#526655]"><MapPin size={17} className="text-gold shrink-0" />{company.location}</p>
          <a href={`tel:+91${company.phone}`} className="flex items-center gap-3 mt-4 text-sm text-[#526655] hover:text-[#9b7b42]"><Phone size={17} className="text-gold" />+91 {company.phone}</a>
          <a href={waLink('Hello, I would like to enquire about your plots.')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 mt-4 text-sm text-[#526655] hover:text-[#9b7b42]"><MessageCircle size={17} className="text-gold" />Chat on WhatsApp</a>
          <div className="flex gap-3 mt-5">{company.instagram && <a href={company.instagram} aria-label="Instagram"><Instagram /></a>}{company.facebook && <a href={company.facebook} aria-label="Facebook"><Facebook /></a>}</div>
        </div>
      </div>
      <div className="container-x border-t border-[#e2e8dd] py-6 flex flex-wrap justify-between gap-3 text-xs text-[#708074]">
        <span>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</span>
        <span>Nabarangpur · Odisha · India</span>
      </div>
    </footer>
  );
}

export function SiteLayout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <a className="fixed z-40 bottom-5 right-5 rounded-full bg-[#25D366] shadow-2xl text-white p-4 hover:scale-105 transition" href={waLink('Hello Maha Laxshmi Builders, I would like to know about available plots.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp enquiry"><MessageCircle size={25} /></a>
    </>
  );
}

export function PageHeading({ label, title, description }: { label: string; title: string; description?: string }) {
  return (
    <section className="pt-40 pb-16 md:pt-48 md:pb-20 bg-[#edf2eb] border-b border-[#e1e6dd] text-[#243c2e]">
      <div className="container-x">
        <p className="eyebrow mb-5">{label}</p>
        <h1 className="heading text-5xl md:text-7xl max-w-4xl">{title}</h1>
        {description && <p className="max-w-2xl text-[#627568] mt-6 leading-8">{description}</p>}
      </div>
    </section>
  );
}

export function PreviewNote() {
  return <div className="container-x mt-7 p-4 text-sm border border-gold/40 bg-[#c9a45c12] text-goldlight">Design preview: project details are drawn from supplied draft materials and require client confirmation. Connect Supabase to show published database listings and enable form submissions.</div>;
}

export function NotFound() {
  return (
    <section className="min-h-[75vh] pt-40 container-x text-center text-[#263b2e]">
      <div className="eyebrow">404 · Page Not Found</div>
      <h1 className="heading text-5xl mt-6">This page doesn&apos;t exist.</h1>
      <Link to="/" className="gold-btn mt-9">Back Home <ArrowUpRight size={16} /></Link>
    </section>
  );
}
