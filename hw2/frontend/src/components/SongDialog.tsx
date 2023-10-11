import { useState } from "react";

// import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
// import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';

import useSongs from "@/hooks/useSongs";
import { createSong, updateSong } from "@/utils/client";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewSongDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
};

type EditSongDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  songId: string;
  title: string;
  singer: string;
  site: string;
};

type SongDialogProps = NewSongDialogProps | EditSongDialogProps;

export default function SongDialog(props: SongDialogProps) {
  const { variant, open, onClose, listId } = props;
  const title = variant === "edit" ? props.title : "";
  const singer = variant === "edit" ? props.singer : "";
  const site = variant === "edit" ? props.site : "";

  const [editingTitle, setEditingTitle] = useState(variant === "new");
  const [editingSinger, setEditingSinger] = useState(
    variant === "new",
  );
  const [editingSite, setEditingSite] = useState(
    variant === "new",
  );
  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const [newSinger, setNewSinger] = useState(singer);
  const [newSite, setNewSite] = useState(site);
  const [newListId, setNewListId] = useState(listId);

  const [other, setOther] = useState(false);

  const handleClickOpenOther = () => {
    setOther(true);
  };

  const handleCloseOther = () => {
    setOther(false);
  };

  const { lists, fetchSongs } = useSongs();

  const handleClose = () => {
    onClose();
  };

  const handleSave = async () => {
    try {
      if (variant === "new") {
        await createSong({
          title: newTitle,
          singer: newSinger,
          site: newSite,
          list_id: listId,
        });
      } else {
        if (
          newTitle === title &&
          newSinger === singer &&
          newSite === site &&
          newListId === listId
        ) {
          return;
        }
        // typescript is smart enough to know that if variant is not "new", then it must be "edit"
        // therefore props.songId is a valid value
        if(newListId === listId)
        {
          await updateSong(props.songId, {
            title: newTitle,
            singer: newSinger,
            site: newSite,
            list_id: newListId,
          });
        }
        else
        {
          await updateSong(props.songId, {
            title: newTitle,
            singer: newSinger,
            site: newSite,
            list_id: listId,
          });
          await createSong({
            title: newTitle,
            singer: newSinger,
            site: newSite,
            list_id: newListId,
          });
        }

      }
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to save song");
    } finally {
      handleClose();
    }
  };

  // const handleDelete = async () => {
  //   if (variant !== "edit") {
  //     return;
  //   }
  //   try {
  //     await deleteSong(props.songId);
  //     fetchSongs();
  //   } catch (error) {
  //     alert("Error: Failed to delete song");
  //   } finally {
  //     handleClose();
  //   }
  // };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {editingTitle ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingTitle(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={title}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter a title for this song..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newTitle}</Typography>
          </button>
        )}

        <Button variant="outlined" onClick={handleClickOpenOther}>
        新增至別的播放清單
      </Button>
      <Dialog
        open={other}
        onClose={handleCloseOther}
      >
        <DialogTitle>新增至別的播放清單</DialogTitle>
        <DialogContent>
          <DialogContentText>
            選擇你想新增這首歌的播放清單（選擇原來的則不會新增）
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
    
            <Select
              value={newListId}
              onChange={(e) => setNewListId(e.target.value)}
            >
              {lists.map((list) => (
                <MenuItem value={list.id} key={list.id}>
                  {list.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCloseOther}>Close</Button>
        </DialogActions>
      </Dialog>


      </DialogTitle>
      <DialogContent className="w-[600px]">
        {editingSinger ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingSinger(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={singer}
              placeholder="enter the singer's name"
              onChange={(e) => setNewSinger(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingSinger(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSinger}</Typography>
          </button>
        )}
        {editingSite ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingSite(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={site}
              placeholder="enter the song's adress"
              onChange={(e) => setNewSite(e.target.value)}
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingSite(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSite}</Typography>
          </button>
        )}
        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
