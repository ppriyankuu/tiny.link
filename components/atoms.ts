import { atom } from 'recoil';
import { LinksType } from './types';

export const links_State = atom<LinksType[]>({
  key: 'links_State',
  default: [],
});

// anchor
export const anchorElState = atom<any>({
  key: 'anchorElState',
  default: null,
});
