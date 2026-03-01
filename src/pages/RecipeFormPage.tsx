import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useRecipe } from '../hooks/useRecipe'
import { useIngredients } from '../hooks/useIngredients'
import IngredientList, { type IngredientFormData } from '../components/IngredientList'

export default function RecipeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const { recipe, loading: loadingRecipe } = useRecipe(id)
  const { ingredients: masterIngredients, findOrCreate } = useIngredients()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [servings, setServings] = useState(1)
  const [ingredients, setIngredients] = useState<IngredientFormData[]>([
    { name: '', quantity: 0, unit: 'units' },
  ])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (recipe) {
      setName(recipe.name)
      setDescription(recipe.description ?? '')
      setServings(recipe.servings)
      if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        setIngredients(
          recipe.recipe_ingredients.map(ing => ({
            id: ing.id,
            ingredientId: ing.ingredient_id ?? undefined,
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
          }))
        )
      }
    }
  }, [recipe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)

    const validIngredients = ingredients.filter(i => i.name.trim() && i.quantity > 0)

    // Ensure all ingredients have a master ingredient entry
    const ingredientRows = await Promise.all(
      validIngredients.map(async (ing) => {
        const master = await findOrCreate(ing.name)
        return {
          name: master.name, // Use canonical name from master
          quantity: ing.quantity,
          unit: ing.unit,
          ingredient_id: master.id,
        }
      })
    )

    if (isEdit && id) {
      await supabase
        .from('recipes')
        .update({ name: name.trim(), description: description.trim() || null, servings })
        .eq('id', id)

      await supabase.from('recipe_ingredients').delete().eq('recipe_id', id)
      if (ingredientRows.length > 0) {
        await supabase.from('recipe_ingredients').insert(
          ingredientRows.map(ing => ({ ...ing, recipe_id: id }))
        )
      }

      navigate(`/recipes/${id}`)
    } else {
      const { data: newRecipe } = await supabase
        .from('recipes')
        .insert({ name: name.trim(), description: description.trim() || null, servings })
        .select()
        .single()

      if (newRecipe && ingredientRows.length > 0) {
        await supabase.from('recipe_ingredients').insert(
          ingredientRows.map(ing => ({ ...ing, recipe_id: newRecipe.id }))
        )
      }

      navigate(newRecipe ? `/recipes/${newRecipe.id}` : '/')
    }

    setSaving(false)
  }

  if (isEdit && loadingRecipe) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; Back
      </button>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {isEdit ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Recipe name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="Optional description"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
          <input
            type="number"
            value={servings}
            onChange={e => setServings(parseInt(e.target.value) || 1)}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm"
            min="1"
          />
        </div>

        <IngredientList
          ingredients={ingredients}
          masterIngredients={masterIngredients}
          onChange={setIngredients}
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </form>
    </div>
  )
}
