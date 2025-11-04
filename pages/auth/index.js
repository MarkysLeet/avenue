import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthIndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    const { returnTo } = router.query;
    const search = returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : '';
    router.replace(`/auth/login${search}`);
  }, [router, router.query.returnTo]);

  return null;
};

export default AuthIndexPage;
