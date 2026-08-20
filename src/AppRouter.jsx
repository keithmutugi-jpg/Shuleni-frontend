import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import { AuthProvider, RequireRole } from './store/AuthContext';

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
 * Three parallel route trees (owner / educator / student), each
 * guarded by RequireRole so a student can't open /owner/* by typing
 * the URL, and each backed by real per-school data via AuthContext.
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
          <Route
            path="/owner"
            element={
              <RequireRole role="owner">
                <AppShell base="/owner" footerLabel="Owner Dashboard" />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<OwnerDashboard />} />
            <Route path="resources" element={<ResourceLibrary />} />
            <Route path="attendance" element={<AttendanceView />} />
            <Route path="chats" element={<ChatRoom />} />
          </Route>

          {/* Educator */}
          <Route
            path="/educator"
            element={
              <RequireRole role="educator">
                <AppShell base="/educator" footerLabel="Educator Dashboard" />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<EducatorDashboard />} />
            <Route path="resources" element={<ResourceLibrary />} />
            <Route path="attendance" element={<AttendanceView />} />
            <Route path="chats" element={<ChatRoom />} />
          </Route>

          {/* Student */}
          <Route
            path="/student"
            element={
              <RequireRole role="student">
                <AppShell base="/student" footerLabel="Student Dashboard" />
              </RequireRole>
            }
          >
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<StudentDashboard />} />
            <Route path="resources" element={<ResourceLibrary />} />
            <Route path="attendance" element={<AttendanceView />} />
            <Route path="chats" element={<ChatRoom />} />
          </Route>

          {/* Distraction-free exam, outside the shell but still guarded */}
          <Route
            path="/student/exam"
            element={
              <RequireRole role="student">
                <ExamInterface />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
