# Deployment and operations

## Supabase

1. Create a Supabase project and keep its database password in a password manager.
2. In **Project settings → API**, copy the Project URL and publishable key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
3. Copy the service-role key into `SUPABASE_SERVICE_ROLE_KEY`. It is server-only: never place it in `NEXT_PUBLIC_*` or client code.
4. In **SQL Editor**, run [`supabase/schema.sql`](../supabase/schema.sql).
5. In **Authentication → Users**, create the owner user. Copy its UUID and run: `insert into public.owner_accounts (user_id) values ('UUID');`.
6. Set the same account email as `SITE_OWNER_EMAIL`, disable public sign-ups, configure the local and production redirect URLs, and enable MFA for the owner account.

## Cloudflare R2

1. Create an R2 bucket and a token limited to that bucket with Object Read & Write permissions.
2. Put the account ID, access key ID, secret access key, bucket name, and public bucket URL in the matching `R2_*` values in `.env.local`.
3. Configure the bucket CORS policy to permit `PUT`, `GET`, `HEAD`, and `DELETE` from the local and production site origins, with the `Content-Type` header.
4. Keep the bucket private when possible. The app creates one-minute signed upload URLs from its server-only R2 credentials.

## Vercel

1. Push this repository to GitHub, then import it in Vercel as a Next.js project.
2. Add every value from `.env.example`. Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are browser-safe; all others are secret.
3. Set `SITE_URL` and `KEEPALIVE_SECRET` as GitHub Actions secrets, then run **Keep Supabase active** manually once.
4. Add `SUPABASE_DB_URL` as a GitHub Actions secret, run **Weekly database backup** once, and download its artifact to verify it is usable.
5. Add the Vercel URL to Supabase Authentication redirect URLs. Run a production sign-in and `/api/health` check before publishing content.

## Restoring and media backup

- Restore a database dump into a fresh project with `pg_restore --no-owner --no-privileges --dbname "$DATABASE_URL" backup.dump`.
- Back up R2 separately with `rclone sync` to private storage, or download the bucket manually. Download an application-level export monthly and keep it outside the cloud account.
