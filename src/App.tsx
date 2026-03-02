import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RecipeListPage from './pages/RecipeListPage'
import RecipeFormPage from './pages/RecipeFormPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import ShoppingListPage from './pages/ShoppingListPage'
import IngredientsPage from './pages/IngredientsPage'
import PantryPage from './pages/PantryPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<RecipeListPage />} />
          <Route path="/recipes/new" element={<RecipeFormPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/recipes/:id/edit" element={<RecipeFormPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/pantry" element={<PantryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
