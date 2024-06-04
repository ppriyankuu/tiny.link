'use server';

import toast from 'react-hot-toast';
import { localURI } from './source';

export const handleRemoveLink = async (userId: number, linkId: number) => {
  try {
    const response = await fetch(
      `${localURI}/api/links?userId=${userId}&linkId=${linkId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { bool: false };
    }

    const result = await response.json();
    return { bool: true, links: result.links };
  } catch (error: any) {
    console.log('something went wrong : ', error.message);
  }
};

export const handleInactiveLink = async (userId: number, linkId: number) => {
  try {
    const response = await fetch(
      `${localURI}/api/links?userId=${userId}&linkId=${linkId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return { bool: false };
    }

    const result = await response.json();
    return { bool: true, links: result.links };
  } catch (error: any) {
    console.log('something went wrong : ', error.message);
  }
};
