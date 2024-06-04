'use client';

import { LinkIcon } from 'lucide-react';
import { IconButton } from '@mui/material';
import { QrCode2 } from '@mui/icons-material';
import { ContentCopy } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { toPng } from 'html-to-image';
import QRCode from 'react-qr-code';
import { Backdrop } from '@mui/material';
import { Box } from '@mui/material';
import { Modal } from '@mui/material';
import { Fade } from '@mui/material';
import { Typography } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

import logo from '@/public/tinyhost.png';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { localURI } from '@/components/source';
import Link from 'next/link';
import { useSetRecoilState } from 'recoil';
import { links_State } from '@/components/atoms';
import { TableComponent } from '@/components/table';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

const styleLink = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
};

export default function Dashboard() {
  const router = useRouter();
  const params = useParams();

  const setLinkData = useSetRecoilState(links_State);

  const [url, setUrl] = useState<string>('');
  const [openQr, setOpenQr] = useState<boolean>(false);
  const [qrIsVisible, setQrIsVisible] = useState<boolean>(false);
  const [openAddLink, setOpenAddLink] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');
  const [link, setLink] = useState<string>('');

  const qrCodeRef = useRef(null);

  const { slug } = params;

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (!authToken) return router.push('/signin');

    if (typeof window !== undefined) {
      const currentUrl = window.location.href;
      const replacedUrl = currentUrl.replace('dashboard', 'view');
      setUrl(replacedUrl);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${localURI}/api/links?userId=${slug}`);
      const data = await response.json();
      setLinkData(data.links);
    } catch (error: any) {
      console.log('something went wrong : ', error.message);
    }
  };

  useEffect(() => {
    if (slug) fetchUserData();
  }, [slug]);

  const handleOpenQR = () => {
    setOpenQr(true);

    if (!url) return;

    setQrIsVisible(true);
  };

  const handleCloseQR = () => setOpenQr(false);

  const handleOpenAddLinks = () => setOpenAddLink(true);

  const handleCloseAddLinks = () => setOpenAddLink(false);

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    toPng(qrCodeRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'qr-code.png';
        link.click();
      })
      .catch((err: any) => console.log('something went wrong : ', err.message));
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Link copied!');
      })
      .catch((err: any) => console.log(`something went wrong: ${err.message}`));
  };

  const handleAddLink = async () => {
    const bodyObject = {
      userId: Number(slug),
      title,
      link,
    };

    const response = await fetch(`${localURI}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObject),
    });

    setTitle('');
    setLink('');

    if (!response.ok) {
      toast.error('something went wrong!');
      return;
    }

    const result = await response.json();

    setLinkData(result.links);

    toast.success('Successfully added link');
    handleCloseAddLinks();
  };

  return (
    <div style={{ backgroundColor: '#fbfbfb' }}>
      <div className="flex justify-center items-center headerDiv">
        <div className="w-5/6 border rounded-2xl min-h-8 xl:p-2 2xl:p-4 mt-10 bg-white shadow-[0_12px_41px_-11px_rgba(199,199,199)]">
          <div className="flex">
            <Image
              src={logo}
              alt="logo"
              style={{ height: '11%', width: '11%' }}
            />
            <span className=" text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 ml-10 mr-5">
              <Link href={`/view/${slug}`}>Links</Link>
            </span>
            <span className="text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 mr-5">
              Inventory
            </span>
            <span className="text-base cursor-pointer xl:mt-1.5 2xl:mt-4 font-sans text-slate-500 mr-5">
              Blogs
            </span>
            <button
              onClick={() => {
                Cookies.remove('authToken');
                router.push('/signin');
              }}
              className="bg-purple-200 text-sm text-purple-700 font-medium ml-auto rounded-lg xl:h-8 xl:pt-0 xl:pb-0 xl:pl-1 xl:pr-1 2xl:pt-1 2xl:pb-1 2xl:pl-2 2xl:pr-2 h-10 mt-2"
            >
              Sign Out
            </button>
          </div>
        </div>
        <Toaster />
      </div>
      <div className="text-[#333] rounded-xl font-[sans-serif] linkDiv">
        <div className="w-full flex items-center justify-center xl:pt-8  2xl:mt-10 2xl:pt-10">
          <span className="mt-4 text-xl font-sans text-purple-700 font-medium">
            Your link :{' '}
            <span className="text-sm text-gray-600 font-sans font-medium ml-2 mr-5">
              {' '}
              {url}
            </span>
            <Tooltip title="Copy" onClick={() => copyToClipboard(url)}>
              <IconButton
                style={{
                  fontSize: 13,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderRadius: 7,
                  border: '1px solid #19a89d',
                  color: '#19a89d',
                  fontWeight: 700,
                }}
              >
                Copy URL
                <ContentCopy
                  style={{ fontSize: 17, color: '#19a89d', marginLeft: 7 }}
                  fontSize="small"
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Generate QR Code" onClick={handleOpenQR}>
              <IconButton
                style={{
                  fontSize: 13,
                  paddingTop: 3,
                  paddingBottom: 3,
                  paddingLeft: 5,
                  paddingRight: 5,
                  borderRadius: 7,
                  border: '1px solid #8a53fe',
                  color: '#8a53fe',
                  fontWeight: 700,
                  marginLeft: 17,
                }}
              >
                Generate QR Code
                <QrCode2
                  fontSize="small"
                  style={{ fontSize: 22, color: '#8a53fe', marginLeft: 7 }}
                />
              </IconButton>
            </Tooltip>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openQr}
              onClose={handleCloseQR}
              closeAfterTransition
              slots={{ backdrop: Backdrop }}
              slotProps={{
                backdrop: {
                  timeout: 500,
                },
              }}
            >
              <Fade in={openQr}>
                <Box sx={style} className="border-0">
                  <Typography
                    id="transition-modal-title"
                    variant="subtitle1"
                    component="h1"
                  >
                    Your Unique link QR Code is ready
                  </Typography>
                  {qrIsVisible && (
                    <div className="qrcode__download" ref={qrCodeRef}>
                      <div className="qrcode__image">
                        <QRCode value={url} size={200} />
                      </div>
                      <button
                        className="bg-purple-200 text-purple-700 border rounded-lg p-3"
                        onClick={downloadQRCode}
                      >
                        Download QR Code
                      </button>
                    </div>
                  )}
                </Box>
              </Fade>
            </Modal>
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center liveCard max-w-[1200px] mx-auto">
        <div className=" xl:h-content 2xl:h-content w-content bg-white border rounded-2xl shadow-[0_12px_41px_-11px_rgba(199,199,199)]">
          <div className="xl:mx-3 xl:mt-2 2xl:mx-6 2xl:mt-5">
            <div className="flex justify-between xl:mt-3 2xl:mt-6">
              <div className="font-sans text-2xl font-medium subpixel-antialiased flex">
                Live Links
                <div
                  className="bg-purple-200 text-purple-800 w-fit h-auto p-1 font-sans mt-1.5 ml-3 mb-2"
                  style={{ borderRadius: 10 }}
                >
                  <div className="font-sans mr-1 ml-1 text-xs font-base">
                    2/4 Live
                  </div>
                </div>
              </div>
              <button
                className="font-sans flex gap-1 items-center font-medium text-xs px-3 py-2 rounded-2xl bg-black text-white"
                onClick={handleOpenAddLinks}
              >
                <LinkIcon fontSize="1" /> Add Link
              </button>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openAddLink}
                onClose={handleCloseAddLinks}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                  backdrop: {
                    timeout: 500,
                  },
                }}
              >
                <Fade in={openAddLink}>
                  <Box sx={styleLink} className="border-0">
                    <Typography
                      alignContent={'center'}
                      id="transition-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Add Link
                    </Typography>
                    <div className="mt-5">
                      <div>Title :</div>
                      <div>
                        <input
                          type="text"
                          className="mt-3 h-10 w-full  border-2 p-3  rounded-lg mb-5 "
                          placeholder="Enter title"
                          onChange={(e) => setTitle(e.target.value)}
                          value={title}
                        ></input>
                      </div>
                      <div>Link :</div>
                      <div>
                        <input
                          type="text"
                          className="mt-3 h-10 w-full  border-2 p-3  rounded-lg"
                          placeholder="Enter link"
                          onChange={(e) => setLink(e.target.value)}
                          value={link}
                        ></input>
                      </div>
                      <button
                        className="font-medium mt-5 bg-purple-200 text-purple-700 border rounded-lg pt-1 pb-1 pr-2.5 pl-2.5 h-fit"
                        onClick={handleAddLink}
                      >
                        Add Link
                      </button>
                    </div>
                  </Box>
                </Fade>
              </Modal>
            </div>
            <div className="font-sans xl:mt-5 xl:mb-2 2xl:mt-10 2xl:mb-4"></div>
            <TableComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
