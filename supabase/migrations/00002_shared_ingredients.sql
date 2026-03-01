-- Master ingredients table
create table ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Allow all for single-user app
alter table ingredients enable row level security;
create policy "Allow all on ingredients" on ingredients
  for all using (true) with check (true);

-- Add foreign key from recipe_ingredients to ingredients
alter table recipe_ingredients
  add column ingredient_id uuid references ingredients(id);

-- Create index for lookups
create index idx_ingredients_name on ingredients(name);
create index idx_recipe_ingredients_ingredient_id on recipe_ingredients(ingredient_id);
