import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import { AuthProvider } from './context/AuthContext';

import LoginScreen from './pages/LoginScreen';
import RegisterSchoolScreen from './pages/RegisterSchoolScreen';
import OwnerDashboard from './pages/OwnerDashboard';
import EducatorDashboard from './pages/EducatorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ResourceLibrary from './pages/ResourceLibrary';
import AttendanceView from './pages/AttendanceView';
import ChatRoom from './pages/ChatRoom';
import ExamInterface from './pages/ExamInterface';

/**
 * Keith's area: authentication, routing and role-based access.
 * Three parallel route trees (owner / educator / student) share the
 * same AppShell + nav, so every role sees the identical Figma look.
 */
export default function AppRouter() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterSchoolScreen />} />

        {/* School owner */}
        <Route path="/owner" element={<AppShell base="/owner" userInitials="OW" footerLabel="Owner Dashboard" />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<OwnerDashboard />} />
          <Route path="resources" element={<ResourceLibrary />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="chats" element={<ChatRoom />} />
        </Route>

        {/* Educator */}
        <Route path="/educator" element={<AppShell base="/educator" userInitials="TJ" footerLabel="Educator Dashboard" />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<EducatorDashboard />} />
          <Route path="resources" element={<ResourceLibrary />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="chats" element={<ChatRoom />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<AppShell base="/student" userInitials="AO" footerLabel="Student Dashboard" />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<StudentDashboard />} />
          <Route path="resources" element={<ResourceLibrary />} />
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="chats" element={<ChatRoom />} />
        </Route>

        {/* Distraction-free exam, outside the shell */}
        <Route path="/student/exam" element={<ExamInterface />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
