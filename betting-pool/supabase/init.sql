-- Create the bets table
create table if not exists public.bets (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    football_winner text,
    football_score text,
    taylor_screen_time integer,
    taylor_proposal text,
    ai_ads integer,
    literacy text
);

-- Enable Row Level Security
alter table public.bets enable row level security;

-- Create a policy that allows anyone to insert
create policy "Anyone can insert bets"
    on public.bets
    for insert
    with check (true);

-- Create a policy that allows anyone to read all bets
create policy "Anyone can view bets"
    on public.bets
    for select
    using (true);

-- Create an index on name for faster lookups
create index if not exists bets_name_idx on public.bets (name);

-- Create an index on created_at for chronological queries
create index if not exists bets_created_at_idx on public.bets (created_at desc);
