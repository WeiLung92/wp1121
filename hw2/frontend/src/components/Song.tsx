import { useState, useEffect } from "react";

import { Paper } from "@mui/material";
import Box from '@mui/material/Box';
import Divider from "@mui/material/Divider";
import Checkbox from '@mui/material/Checkbox';
import SongDialog from "./SongDialog";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link';
export type SongProps = {
  id: string;
  title: string;
  singer: string;
  site: string;
  listId: string;
  all: boolean;
  onCheckboxChange: (isChecked: boolean, songId: string) => void;
};

export default function Song({ id, title, singer, site, listId, all, onCheckboxChange }: SongProps) {
  const [open, setOpen] = useState(false);
  const [songChecked, setSongChecked] = useState(all);


  const handleClickOpen = () => {
    setOpen(true);
  };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!all)
  //     setSongChecked(event.target.checked);
  // };

  const handleChange = () => {
    if(all===true){
      onCheckboxChange(true, id);
    }
    else if(all===false){
      const newCheckedState = !songChecked;
      setSongChecked(newCheckedState);
      // Call the callback function with the song ID and the new checked state
      onCheckboxChange(newCheckedState, id);
    }
  }

  useEffect(() => {
    if(all===true){
      setSongChecked(true);
      onCheckboxChange(true, id);
    }
    else{
      setSongChecked(false);
      onCheckboxChange(false, id);
    }
  }, [all])
  return (
    <>
      <Box
        sx={{
          display: 'flex',

          borderRadius: 1,
        }}
      >
          <Typography className="w-1/3" align = "left">
            <Checkbox
              checked={songChecked || all}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <button onClick={handleClickOpen} className="text-start">
              <Paper className="flex w-full flex-col p-2" elevation={6}>
                {title}
              </Paper>
            </button>
          </Typography>
          <Typography className="w-1/3" align = "left">{singer}</Typography>
          <Typography className="w-1/3" align = "left">      
            <Link href={site} underline="hover">{site}</Link>
          </Typography>
      </Box>
      <Divider variant="middle" />
      <SongDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        singer={singer}
        site={site}
        listId={listId}
        songId={id}
      />
    </>
  );
}
