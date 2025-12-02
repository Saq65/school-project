import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddSchool from './pages/AddSchool';
import ShowSchools from './pages/ShowSchools';

export default function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Navigate to="/add-school" replace />} />
                    <Route path="/add-school" element={<AddSchool />} />
                    <Route path="/schools" element={<ShowSchools />} />
                </Routes>
            </div>
        </Router>
    );
}

