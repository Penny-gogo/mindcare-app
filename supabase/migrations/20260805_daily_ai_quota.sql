create table if not exists public.daily_ai_usage (
  identity_key text not null,
  usage_date date not null default (timezone('utc', now()))::date,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (identity_key, usage_date)
);

alter table public.daily_ai_usage enable row level security;

revoke all on table public.daily_ai_usage from anon, authenticated;

create or replace function public.consume_daily_ai_quota(
  p_identity_key text,
  p_daily_limit integer
)
returns table (allowed boolean, remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_identity_key is null or length(p_identity_key) < 3 then
    raise exception 'invalid identity key';
  end if;
  if p_daily_limit < 1 or p_daily_limit > 100 then
    raise exception 'invalid daily limit';
  end if;

  insert into public.daily_ai_usage (identity_key, usage_date, request_count)
  values (p_identity_key, (timezone('utc', now()))::date, 1)
  on conflict (identity_key, usage_date) do update
    set request_count = public.daily_ai_usage.request_count + 1,
        updated_at = now()
    where public.daily_ai_usage.request_count < p_daily_limit
  returning request_count into v_count;

  if v_count is null then
    select request_count into v_count
    from public.daily_ai_usage
    where identity_key = p_identity_key
      and usage_date = (timezone('utc', now()))::date;
    return query select false, 0;
  else
    return query select true, greatest(p_daily_limit - v_count, 0);
  end if;
end;
$$;

revoke all on function public.consume_daily_ai_quota(text, integer) from public, anon, authenticated;
grant execute on function public.consume_daily_ai_quota(text, integer) to service_role;