import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FolderList from './components/FolderList';
import FolderContent from './components/FolderContent';
import { FolderProvider } from './components/FolderContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import 'bootstrap';
import BlueprintEditor from './components/BlueprintEditor';
import BlueprintOrder from './components/BlueprintOrder';
import AdminLogin from './components/AdminLogin';
import AdminRegistration from './components/AdminRegistration';
import { AuthProvider } from './components/AuthContext';

function App() {
    return (
        <AuthProvider>
        <Router>
            <div className="App">
                <FolderProvider>
                    <Routes> 
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/register" element={<AdminRegistration />} />
                        <Route path="/folders/:folderId" element={<FolderContent />} />
                        <Route path="/" element={<FolderList />} exact />
                        <Route path="/editor" element={<BlueprintEditor />} />
                        <Route path="/order" element={<BlueprintOrder />} />
                    </Routes>
                </FolderProvider>
            </div>
        </Router>
        </AuthProvider>
    );
}

export default App;

