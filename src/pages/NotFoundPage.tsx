import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요</h1>
      <Link to="/" className="text-blue-500 underline">
        홈으로 가기
      </Link>
    </section>
  );
}

export default NotFoundPage;
