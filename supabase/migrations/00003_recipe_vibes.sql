-- Vibe enum
create type recipe_vibe as enum (
  'vegetarian',
  'vegan',
  'comfort',
  'quick',
  'spicy',
  'soup',
  'curry',
  'pasta',
  'roast',
  'stir-fry',
  'pie',
  'one-pot',
  'classic-combo'
);

-- Join table for recipe vibes
create table recipe_vibes (
  recipe_id uuid not null references recipes(id) on delete cascade,
  vibe recipe_vibe not null,
  primary key (recipe_id, vibe)
);

create index idx_recipe_vibes_recipe_id on recipe_vibes(recipe_id);

-- RLS
alter table recipe_vibes enable row level security;

create policy "Allow all on recipe_vibes" on recipe_vibes
  for all using (true) with check (true);
