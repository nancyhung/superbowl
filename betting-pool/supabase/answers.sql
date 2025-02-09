-- Create the correct_answers table
create table if not exists public.correct_answers (
    id uuid default uuid_generate_v4() primary key,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    football_winner text,
    football_score text,
    taylor_screen_time integer,
    taylor_proposal text,
    ai_ads integer,
    literacy text
);

-- Enable RLS
alter table public.correct_answers enable row level security;

-- Only allow one row in the correct_answers table
create unique index if not exists single_answer_row on public.correct_answers ((true));

-- Create a policy that allows anyone to read the answers
create policy "Anyone can view answers"
    on public.correct_answers
    for select
    using (true);

-- Insert a default row (we'll update this later through the admin interface)
insert into public.correct_answers (football_winner, football_score, taylor_screen_time, taylor_proposal, ai_ads, literacy)
values (null, null, null, null, null, null)
on conflict do nothing;
