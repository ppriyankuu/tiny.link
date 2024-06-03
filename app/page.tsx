'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => router.push('/signin'), []);

  return <div className="font-mono font-bold">Tiny.link</div>;
}
