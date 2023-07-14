// import { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Contacts from './pages/Contacts';
import Home from './pages/Home';
import PrivateRouter from './styles/routes/PrivateRouter';
import PageNotFound from './pages/PageNotFound';
// import PublicRouter from './routes/PublicRoute';
function App() {


  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/contacts' element={
          <PrivateRouter>
            <Contacts />
          </PrivateRouter>
        } />
        <Route path='/' element={
          <PrivateRouter>
            <Home />
          </PrivateRouter>
        } />

        <Route path='*' element={ <PageNotFound /> } />
      </Routes>
    </>
  )
}

export default App
