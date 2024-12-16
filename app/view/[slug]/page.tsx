'use client';


import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { localURI } from '@/components/source';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { links_State } from '@/components/atoms';
import { useRecoilState } from 'recoil';

export default function View() {
  const params = useParams();
  const [userData, setUserData] = useRecoilState(links_State);
  const [username, setUsername] = useState<string>('cranky');

  const { slug } = params;

  const fetchUserData = async () => {
    const response = await fetch(`${localURI}/api/links?userId=${slug}`);

    if (!response.ok) {
      toast.error('something went wrong');
      return;
    }

    const result = await response.json();

    console.log(result.links);

    toast.success('Welcome!');
    setUserData(result.links);
    setUsername(result.username);
  };

  useEffect(() => {
    if (slug) {
      fetchUserData();
    }
  }, [slug]);

  const handleLink = (url: string) => {
    const newTab = window.open(url, '_blank');

    if (newTab) newTab.focus();
    else console.log('Please allow pop-ups for this site to open the link.');
  };

  return (
    <div className="backggroundColor flex justify-center w-full h-full">
      <div className="flex justify-center flex-col items-center w-2/6">
        <div className="circle">
          <p className="circle-inner">PK</p>
        </div>
        <div className="userName cursor-pointer">
          <Link href={`/dashboard/${slug}`}>@{username}</Link>
        </div>
        {userData.length > 0
          ? userData.map((item: any, index: any) => {
              return item.status === 'active' ? (
                <motion.div
                  animate={{ y: -10 }}
                  transition={{
                    type: 'spring',
                    duration: 1,
                    stiffness: 100,
                    damping: 10,
                  }}
                  key={index}
                  className="cursor-pointer w-3/6 bg-white min-h-12 text-cyan-500 mb-2 border rounded-2xl mt-2 font-sans text-lg font-normal pl-12 pr-12 pt-2 pb-2"
                >
                  <div
                    className="flex justify-center items-center bg-white font-medium font-sans"
                    onClick={() => handleLink(item.link)}
                  >
                    {item.title}
                  </div>
                </motion.div>
              ) : (
                null
              );
            })
          : null}
      </div>
    </div>
  );
}
