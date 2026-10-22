-- Second Look database. Run once in Supabase: SQL Editor > New query > paste > Run.
-- Stores no message text, phone numbers, names or IP addresses.

-- One row per person per reported website. reporter is a one-way hash, so the same person
-- can't count twice, but who they are can't be recovered from it.
create table if not exists scam_reports (
  id          bigserial primary key,
  domain      text not null check (char_length(domain) between 3 and 253),
  reporter    text not null check (char_length(reporter) = 64),
  created_at  timestamptz not null default now(),
  unique (domain, reporter)
);
create index if not exists scam_reports_domain on scam_reports (domain);

-- "Was this result right?" answers. Only the verdict shown and which checks fired.
create table if not exists result_feedback (
  id          bigserial primary key,
  verdict     text not null check (verdict in ('danger', 'suspicious', 'no_red_flags')),
  correct     boolean not null,
  codes       text[] not null default '{}' check (cardinality(codes) <= 30),
  lang        text not null default 'en' check (lang in ('en', 'fil')),
  created_at  timestamptz not null default now()
);

-- Supabase also exposes tables through a public web API. Row level security with no public
-- policies closes that door: only the app's own database user (below) can touch these tables.
alter table scam_reports enable row level security;
alter table result_feedback enable row level security;

-- Least privilege: the app's database user can add rows and read report counts, nothing else.
-- Create it first, with your own long password, by running this line on its own:
--   create role second_look_app login password 'PUT-A-LONG-RANDOM-PASSWORD-HERE';
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'second_look_app') then
    grant usage on schema public to second_look_app;
    grant select, insert on scam_reports to second_look_app;
    grant insert on result_feedback to second_look_app;
    grant usage on sequence scam_reports_id_seq, result_feedback_id_seq to second_look_app;
    drop policy if exists app_reports on scam_reports;
    create policy app_reports on scam_reports for all to second_look_app using (true) with check (true);
    drop policy if exists app_feedback on result_feedback;
    create policy app_feedback on result_feedback for insert to second_look_app with check (true);
  end if;
end $$;
