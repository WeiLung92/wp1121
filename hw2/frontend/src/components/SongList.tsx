import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Card from "@mui/material/Card";
import CardMedia from '@mui/material/CardMedia';
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs.tsx";
import { deleteList, updateList } from "@/utils/client";

import Song from "./Song";
import type { SongProps } from "./Song";
import SongDialog from "./SongDialog";

export type SongListProps = {
  id: string;
  name: string;
  songs: SongProps[];
  deleting: boolean;
};

export default function SongList({ id, name, songs, deleting }: SongListProps) {
  const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const { fetchLists } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
    if (newName !== name) {
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEditingName(false);
  };

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      <Card className="w-80 ">
        <div className="grid place-items-end">
          {deleting?(
            <IconButton color="error"  onClick={handleDelete} sx={{p:0}}>
              <HighlightOffTwoToneIcon />
            </IconButton>
          ):(
            <div className="p-3"></div>
          )}
        </div>
        <CardMedia
          component="img"
          height="194"
          image="https://images.chinatimes.com/newsphoto/2022-03-01/656/20220301002802.jpg"

        />
        <div className="flex gap-4">
          {editingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
            </button>
          )}
          </div>
            
        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
        <div className="flex flex-col gap-4">
          {songs.map((song) => (
            <Song key={song.id} {...song} />
          ))}
          <Button
            variant="contained"
            onClick={() => setOpenNewSongDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a song
          </Button>
        </div>
      </Card>
      <SongDialog
        variant="new"
        open={openNewSongDialog}
        onClose={() => setOpenNewSongDialog(false)}
        listId={id}
      />
    </>
  );
}
