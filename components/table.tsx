import {
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  styled,
  tableCellClasses,
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { anchorElState, links_State } from './atoms';
import { LinksType } from './types';
import Link from 'next/link';
import {
  ContentCopy,
  Delete,
  Edit,
  LinkOff,
  LinkSharp,
  MoreVert,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { handleInactiveLink, handleRemoveLink } from './actions';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f3f4f6',
    color: '#898989',
    fontSize: 12,
    border: 0,
    padding: 11,
    [theme.breakpoints.down('xl')]: {
      fontSize: 10,
      padding: 8,
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    border: 0,
    padding: 14,
    [theme.breakpoints.down('xl')]: {
      fontSize: 9,
      padding: 10,
    },
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const TableComponent = () => {
  const [linkData, setLinkData] = useRecoilState(links_State);
  const [anchorEl, setAnchorEl] = useRecoilState(anchorElState);

  const [currentLinkId, setCurrentLinkId] = useState<number | null>(null);

  const handleClose = () => setAnchorEl(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Link copied!');
      })
      .catch((err: any) => console.log(`something went wrong: ${err.message}`));
  };

  return (
    <div className="pb-5">
      <Table
        sx={{ minWidth: 400, border: 'none' }}
        aria-label="customized table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell
              align="left"
              style={{
                borderTopLeftRadius: 15,
                borderBottomLeftRadius: 15,
              }}
            >
              Status
            </StyledTableCell>
            <StyledTableCell align="left">Domain</StyledTableCell>
            <StyledTableCell
              align="center"
              style={{
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
              }}
            >
              Actions
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {linkData?.map((row: LinksType) => {
            return (
              <StyledTableRow key={row.id}>
                <StyledTableCell
                  align="left"
                  style={{
                    borderTopLeftRadius: 15,
                    borderBottomLeftRadius: 15,
                  }}
                >
                  {row.status === 'active' ? (
                    <div
                      className="bg-green-300 text-green-800 w-fit h-auto p-1 font-sans flex"
                      style={{ borderRadius: 10 }}
                    >
                      {' '}
                      <div className="bg-green-800 w-1 h-1 rounded-xl mt-1.5 ml-1 mr-1"></div>
                      <div className="font-sans mr-1">Active</div>
                    </div>
                  ) : (
                    <div
                      className="bg-red-300 text-red-800 w-fit h-auto p-1 font-sans flex"
                      style={{ borderRadius: 10 }}
                    >
                      {' '}
                      <div className="bg-red-800 w-1 h-1 rounded-xl mt-1.5 ml-1 mr-1"></div>
                      <div className="font-sans mr-1">Inactive</div>
                    </div>
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Link
                    href={row.link}
                    className="text-purple-700 text-sm font-sans font-medium"
                  >
                    {row.link}
                  </Link>
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{
                    borderTopRightRadius: 15,
                    borderBottomRightRadius: 15,
                  }}
                >
                  <div>
                    <Tooltip
                      title='Copy'
                      onClick={() => copyToClipboard(row.link)}
                    >
                      <IconButton>
                        <ContentCopy
                          fontSize="small"
                          style={{ fontSize: 17, color: '#19a89d' }}
                        />
                      </IconButton>
                    </Tooltip>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={anchorEl ? 'long-menu' : undefined}
                      aria-expanded={anchorEl ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(event: any) => {
                        setAnchorEl(event.currentTarget);
                        setCurrentLinkId(row.id);
                      }}
                      size="small"
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                    <Menu
                      open={anchorEl}
                      id="long-menu"
                      MenuListProps={{
                        'aria-labelledby': 'long-button',
                      }}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      style={{
                        width: 'auto',
                        boxShadow: 'none',
                        fontSize: 12,
                        border: '1px solid gray',
                        borderRadius: 15,
                      }}
                    >
                      <MenuItem
                        className="text-sm text-slate-500"
                        onClick={async () => {
                          const response = await handleInactiveLink(
                            row.userId,
                            currentLinkId ?? 0
                          );

                          if (!response?.bool)
                            return toast.error('something went wrong');

                          toast.success('Link updated!');
                          setLinkData(response?.links);
                        }}
                      >
                        {row.status === 'active' ? (
                          <>
                            <LinkOff className="mr-2 inActive text-cyan-500" />
                            {'Inactive'}
                          </>
                        ) : (
                          <>
                            <LinkSharp className="mr-2 inActive text-cyan-500" />
                            {'Activate'}
                          </>
                        )}
                      </MenuItem>
                      <MenuItem
                        className="text-sm text-slate-500"
                        onClick={handleClose}
                      >
                        <Edit className="mr-2 editOptions text-green-500" />{' '}
                        Edit
                      </MenuItem>
                      <MenuItem
                        className="text-sm text-slate-500"
                        onClick={async () => {
                          const response = await handleRemoveLink(
                            row.userId,
                            currentLinkId ?? 0
                          );

                          if (!response?.bool)
                            return toast.error('something went wrong');

                          toast.success('Link deleted!');
                          setAnchorEl(null);
                          setLinkData(response?.links);
                        }}
                      >
                        <Delete className="mr-2 deleteOptions text-red-500" />{' '}
                        Delete
                      </MenuItem>
                    </Menu>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
