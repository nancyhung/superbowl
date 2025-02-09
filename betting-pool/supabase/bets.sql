-- Enable Row Level Security
alter table public.bets enable row level security;

-- Create a policy that allows anyone to insert bets
create policy "Anyone can insert bets"
    on public.bets
    for insert
    with check (true);

-- Create a policy that allows anyone to read all bets
create policy "Anyone can view bets"
    on public.bets
    for select
    using (true);
