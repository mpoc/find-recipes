-- Recipes table
create table recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  servings integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Allowed units as an enum
create type ingredient_unit as enum (
  'units',
  'g',
  'kg',
  'ml',
  'l',
  'cups',
  'tbsp',
  'tsp'
);

-- Recipe ingredients
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  name text not null,
  quantity numeric not null,
  unit ingredient_unit not null default 'units',
  created_at timestamptz not null default now()
);

create index idx_recipe_ingredients_recipe_id on recipe_ingredients(recipe_id);

-- Permissive RLS policies (no auth, single-user app)
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

create policy "Allow all on recipes" on recipes
  for all using (true) with check (true);

create policy "Allow all on recipe_ingredients" on recipe_ingredients
  for all using (true) with check (true);

-- Auto-update updated_at on recipes
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on recipes
  for each row execute function update_updated_at();
