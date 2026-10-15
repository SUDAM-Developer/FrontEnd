import { Outlet } from 'react-router';

// 모든 페이지를 감싸는 공통 레이아웃
function App() {
  return (
    <main className="min-h-dvh">
      <Outlet />
    </main>
  );
}

export default App;
