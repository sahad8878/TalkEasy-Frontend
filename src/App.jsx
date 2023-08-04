import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import './App.css'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import ChatProvider from './Context/ChatProvider'

function App() {


  return (
  <Router>
    <ChatProvider>

   
    <Routes>
      <Route path='/' Component={HomePage} exact />
      <Route path='/chats' Component={ChatPage}/>
    </Routes>
    </ChatProvider>
  </Router>
  )
}

export default App
