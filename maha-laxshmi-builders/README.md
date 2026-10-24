# MAHA LAXSHMI BUILDERS | Premium Real Estate Website

A React + Vite + TypeScript, Tailwind CSS, Framer Motion, React Router and Supabase project. Includes public listings, details, enquiry and site visit forms, Supabase Auth-protected admin, property CRUD, image uploads and lead management.

## Business source and factual status

Based on provided company logo and **two Word documents** containing draft Hindi and Odia promotional copy. Company location: **Nabarangpur, Odisha**. Call / WhatsApp **7205077057**. The supplied logo is preserved at `public/images/company-logo.png` and shown in navigation/footer.

**Important: conflicting source claims have not been published as verified facts.** The Hindi document calls the second project *Samim Khan Plot* with ₹250/sq.ft.; the Odia version calls it *Hirli Prime Valley* with ₹350/sq.ft. Other project prices likewise differ (₹250 versus ₹350/sq.ft.). The documents also disagree about the registration status of *Mahalaxshmi Greens Colony*, and whether *M.B.G Nagar* approval is confirmed. Approvals/registrations are not presented as verified claims. The optional seed includes four other draft listings **unpublished**, and excludes the disputed second project. Review all project data, exact descriptions, compliance documents, pricing and images with the business owner before publishing. The public frontend in no-credentials mode includes visually marked **design preview** cards, not live inventory. Promotional imagery is generic illustrative architecture, not actual project photography.

## Requirements

- Node.js **20.19+ or 22.12+** and npm (modern Vite supported version)
- A Supabase project with Postgres, Auth and Storage enabled
- A static-hosting account such as Vercel / Netlify / Cloudflare Pages

## Run locally

1. Extract the ZIP.
2. Open PowerShell / Terminal in the extracted project folder.
3. `npm install`
4. `cp .env.example .env` on macOS/Linux, or `Copy-Item .env.example .env` in PowerShell.
5. Fill `.env` with the Supabase project URL and publishable (or legacy anon) key from your Supabase dashboard, **never** the service-role key.
6. `npm run dev` and open `http://localhost:5173`.
7. `npm run build` for a production bundle in `dist/`.

Without `.env`, public pages run in an explicitly identified **preview mode** (draft listing cards are not database records). The admin login and form persistence require the Supabase configuration. No contact submissions are silently stored in localStorage.

## Supabase setup

1. Create a project at https://supabase.com/dashboard and select a secure database password.
2. In **SQL Editor**, run `supabase/migrations/001_initial.sql` as project owner. This creates the database tables, indexes, triggers, RLS policies, admin-check function and public-image Storage bucket. It uses `storage.objects` policies. If your project already contains policies with these names, reconcile them before rerunning the initial migration.
3. Under **Authentication > Providers**, enable **Email**. Turn off public signups if not needed and configure your allowed redirect URLs.
4. In Authentication > Users, **create the first user as project owner** and set a strong password. Copy the user's UUID. Do not create a public admin signup page.
5. In **SQL Editor**, assign admin authorization using the authenticated user ID:
   ```sql
   insert into public.admin_users(user_id)
   values ('REPLACE_WITH_ACTUAL_AUTH_USER_UUID');
   ```
6. In Project Settings > API, copy the **Project URL** to `VITE_SUPABASE_URL` and the **publishable** API key to `VITE_SUPABASE_PUBLISHABLE_KEY`. Keep `.env` local and private. NEVER place `service_role` or `sb_secret_` keys in browser variables.
7. Restart `npm run dev`, sign in at `/admin/login`, and create / publish properties in the admin UI. Public cards now read only database-published records.
8. Optional **local development only**: Run `supabase/seed.sql` to add four draft/unpublished reference listings. Confirm the content before publishing. The file contains no admin passwords.

### Storage

Bucket `property-images` is created public, limited to 5 MB/images and JPEG/PNG/WebP/AVIF. Images are public-read; upload/update/delete are limited to authorized administrators. The admin editor can upload a cover and additional gallery images. **Removing an image from a listing removes its reference but does not automatically delete its stored object**, intentionally avoiding accidental removal of shared objects. Periodic orphan-media cleanup should be handled by a privileged owner process after checking references.

### Data access / safeguards

- Public: only reads `published = true` property records; anonymous users can only INSERT contact forms with database constraints and limited insert-column grants, and cannot SELECT private leads.
- Authenticated authorized admin: checks `auth.uid()` in `admin_users` via a `SECURITY DEFINER` function, can manage all properties, read/update leads, and upload images.
- Unapproved sign-in users: blocked both from admin routes and by database RLS.
- Form inputs use Zod/client validation and SQL constraints; duplicate button clicks are suppressed while an operation is ongoing. Honeypot field prevents basic bots.
- **Before an advertising campaign:** enable Cloudflare Turnstile or another CAPTCHA solution using a server-side Edge Function, with IP/user rate limits. Direct anonymous inserts with a public Supabase key do **not** provide robust bot defense or origin enforcement on their own. Supabase Edge Functions with CAPTCHA verification are recommended for production lead capture at scale.
- For stronger policy hardening, consider separating public listing information from private backend fields if introducing private property columns in future. Current property table should contain only publicly safe listing metadata.

## Pages

| Public | Admin |
|---|---|
| `/` Home | `/admin/login` Sign in |
| `/about` About | `/admin` Overview |
| `/properties` Listings | `/admin/properties` Manage properties |
| `/properties/:slug` Details | `/admin/properties/new` Create |
| `/contact` Contact & visit | `/admin/properties/:id/edit` Edit |
| 404 fallback | `/admin/enquiries` Leads |
| | `/admin/site-visits` Visit requests |

Admin property status supports Available / Reserved / Sold and independent Draft / Published. Listings can store nullable area and price, features, multiple image paths and featured flags. Customer forms **persist to Supabase when configured**; WhatsApp deep links open chat with a prefilled message but do not send automatically.

## Company details and images

- Update `src/lib/config.ts`: company name, phone, WhatsApp number, office address, Google Maps, email, social profiles. Unknown fields are empty, so no fabricated data is displayed.
- Replace generic external illustrative photos in `src/pages/Public.tsx` and `src/styles/main.css` with licensed/approved real images when provided.
- Replace `public/images/company-logo.png` only with the actual company-approved logo.
- Add properties, actual images, descriptions, prices, current status and legal claims via Admin.

## Deploy on Vercel

1. Push extracted source to a private GitHub repository.
2. Import repo to Vercel as a **Vite** project.
3. Build command `npm run build`, output directory `dist`.
4. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and optional `VITE_SITE_URL` in Vercel Environment Variables.
5. For client-side page refresh support, use the included `vercel.json` SPA rewrite. Netlify uses `public/_redirects`.
6. Add your production domain to Supabase Auth URL configuration; use HTTPS. Rebuild after changing Vite environment variables.
7. For SEO at scale, consider moving public marketing and property pages to an SSR/prerendering setup. Vite SPA metadata is initially static; `react-helmet` is not included and full crawler rendering/indexation is not guaranteed. Dynamic sitemap generation should be handled at deployment once final domain/property slugs are known.

## Verification and limitations

- Source files and SQL are included and structured for the specified technology stack.
- A TypeScript transpilation/syntax pass was completed on all project `.ts` and `.tsx` source files with **zero syntax diagnostics**. This is not a substitute for a real dependency-aware build.
- This sandbox could not download npm packages from the package registry (installation timed out); therefore **`npm run build` was not successfully executed here**. Please run `npm install`, `npm run build`, and verify any TypeScript errors locally before live deployment.
- No live Supabase project credentials were provided, so RLS, Auth, live CRUD, image storage, and lead submissions **were not end-to-end tested against a deployed project**. Run manual smoke tests after configuration, including anonymous attempts to read enquiries and edit properties.
- The supplied marketing text is promotional draft material, not independent confirmation of approvals, pricing or legal title.

## Acceptance checklist after Supabase setup

- [ ] Admin sign-in/out and expired sessions
- [ ] Unauthorized account denied by RLS
- [ ] Add/edit/delete, status and publish properties
- [ ] Upload cover & gallery images; validate size/type
- [ ] Public listing and unique details URLs, 404
- [ ] Form submission appears in admin with status changes
- [ ] Site visit validation & admin list
- [ ] Anonymous requests cannot SELECT enquiries or visit data
- [ ] Check actual phones/WhatsApp link and mobile responsive layouts (360,390,430,768,1024,1440 px)
- [ ] Verify all draft pricing, approval/registration claims and current availability with client


## October 2026 plotted-land visual revision
- Replaced architectural/building stock photography throughout the public pages with bundled land/plot illustrations: `public/images/plotted-land-hero.webp` and `plot-view-1.webp` through `plot-view-5.webp`. Images are **illustrative mockup visuals**, not photos of the client's plots. Replace them with real aerial drone/site pictures as soon as provided.
- Expanded the homepage with a land selection guide and plot-centric copy.
- The fifth reference is displayed as `Hirli Area Plot` only in unconfigured preview because Hindi and Odia source documents disagree on its project name. Confirm before publishing.
- Project price and registration/approval discrepancies still require client confirmation. Admin can update approved properties with real photos and verified facts.

## Premium long-form homepage revision (October 24, 2026)
- The homepage was expanded into a longer, plot-first layout with a cinematic land hero, five preview project cards, company introduction, buyer-focused benefits, step-by-step enquiry process, location storytelling, FAQ accordion, testimonial placeholders, and enquiry/site visit sections.
- Six bundled generated **3840×2160 WebP presentation assets** are in `public/images/*4k.webp`. These are synthetic conceptual visualizations **not actual plot/site photographs**; do not present them as real completed developments or authentic location imagery. The original generation detail is not enhanced by upscaling, so 3840×2160 asset dimensions do not guarantee true native 4K photographic detail.
- Testimonials are clearly labelled placeholders, not real customer reviews; replace with genuine permissioned client quotes before launch.
- Current source uses a dark-gold premium interface for public and admin routes. Existing Supabase integration code remains present, but a production build and live backend tests are still **unverified** in this environment.

## Clean Website Redesign (October 24, 2026)

The public website has been redesigned in a restrained cream/white/sage-green palette with gold accents. It contains expanded Home, About, Properties, Property Detail and Contact pages. Home includes hero, property collection, company introduction, benefits, site-visit steps, gallery, genuine-feedback invitation, FAQ and enquiry CTA. The original logo, phone number and illustrative plotted-land assets are included locally in `public/images`.

**Ready-to-deploy code is not the same as a configured production service.** Vercel can host the frontend once dependencies install and the build succeeds. If no Supabase environment variables are present, the public project list uses source-derived static fallback data, while the forms explicitly report that server-side submissions require Supabase. To enable real admin access, database property management, images, enquiry storage and site visits, you must configure Supabase and the documented authentication/policies. An empty/static project collection should not be mistaken for verified live availability.

**No fabricated testimonials** are displayed. The customer experiences section is intentionally a genuine-feedback invitation. The six illustrative land images are delivered as 3840×2160 WebP exports but are not real site photographs and are not proof of any project's actual appearance. All disputed prices and legal claims must be confirmed with the company before advertising.

To deploy, follow the Vercel procedure above. Do not set the project's root to `src`. The root is the folder containing `package.json`, the framework is **Vite**, build command is `npm run build`, output is `dist`. Public page navigation uses the `vercel.json` SPA rewrite.

**Verification:** Source syntax is checked with the available globally installed TypeScript compiler. A full dependency-aware production build could not be confirmed here because `npm install` timed out. Always run a real `npm run build` before deploying, and test the live backend after Supabase setup.
