import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { ProjectsPage } from './presentation/pages/ProjectsPage';
import { ProjectShell } from './presentation/pages/ProjectShell';
import { appTheme } from './presentation/theme';

/**
 * /projects/:id 的默认落地页：跳到第 1 步（大纲）。
 * 注意 Navigate 的 to 不会替换 :id，必须从 useParams 取值后拼接，
 * 否则会跳到字面量路径 /projects/:id/outline。
 */
function RedirectToOutline() {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}/outline`} replace />;
}

export default function App() {
  return (
    <ConfigProvider theme={appTheme} locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<RedirectToOutline />} />
          <Route path="/projects/:id/outline" element={<ProjectShell />} />
          <Route path="/projects/:id/assets" element={<ProjectShell />} />
          {/* 资产详情（三栏） */}
          <Route path="/projects/:id/assets/:assetId" element={<ProjectShell />} />
          <Route path="/projects/:id/episodes" element={<ProjectShell />} />
          <Route path="/projects/:id/episodes/:episodeId" element={<ProjectShell />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}