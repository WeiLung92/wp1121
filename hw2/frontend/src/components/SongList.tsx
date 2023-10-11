import { useRef, useState } from "react";

// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Box from '@mui/material/Box';
import Card from "@mui/material/Card";
// import CardActions from '@material-ui/core/CardActions';
import ButtonBase from '@mui/material/ButtonBase';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import CardMedia from '@mui/material/CardMedia';
import Typography from "@mui/material/Typography";

import useSongs from "@/hooks/useSongs";
import { deleteList, updateList } from "@/utils/client";
import { deleteSong } from "@/utils/client";
import Song from "./Song";
import type { SongProps } from "./Song";
import SongDialog from "./SongDialog";



export type SongListProps = {
  id: string;
  name: string;
  description: string;
  songs: Omit<SongProps, "all" | "onCheckboxChange">[];
  deleting: boolean;
};

export default function SongList({ id, name, description, songs, deleting }: SongListProps) {
  const [openNewSongDialog, setOpenNewSongDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const { fetchLists, fetchSongs } = useSongs();
  const inputRef = useRef<HTMLInputElement>(null);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [deleteOrNot, setdeleteOrNot] = useState(false);

  const handleClickOpenDelete = () => {
    if (selectedSongs.length === 0){
      alert("請勾選歌曲");
      setChecked(false);
    }
    else
    {
      setdeleteOrNot(true);
    }
  };

  const handleCloseDelete = () => {
    setdeleteOrNot(false);
  };


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

  const handleUpdateDescription = async () => {
    if (!inputRef.current) return;

    const newDescription = inputRef.current.value;
    if (newDescription !== name) {
      try {
        await updateList(id, { description: newDescription });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list description");
      }
    }
    setEditingDescription(false);
  };


  const handleDeleteList = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  const handleDelete = async () => {
    
    setChecked(false)
    try {
      selectedSongs.map((selectedSong)=>deleteSong(selectedSong));
      fetchSongs();
    } catch (error) {
      alert("Error: Failed to delete song");
    }
    
    setSelectedSongs([]);
    fetchSongs();
    handleCloseDelete();
    
  };

  const handleCheckboxChange = (songId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedSongs((prevSelectedSongs) => [...prevSelectedSongs, songId]);
    } else {
      setSelectedSongs((prevSelectedSongs) =>
        prevSelectedSongs.filter((id) => id !== songId)
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  

  return (
    <>
      <Card className="w-80 ">
        <div className="grid place-items-end">
          {deleting?(
            <IconButton color="error"  onClick={handleDeleteList} sx={{p:0}}>
              <HighlightOffTwoToneIcon />
            </IconButton>
          ):(
            <div className="p-3"></div>
          )}
        </div>
        <ButtonBase onClick = {() => setDialogOpen(true)}>
          <CardMedia
            component="img"
            height="194"
            image="https://images.chinatimes.com/newsphoto/2022-03-01/656/20220301002802.jpg"
          />
        </ButtonBase>
        <Dialog
          fullScreen
          open={DialogOpen}
          onClose={()=>setDialogOpen(false)}
          className="p-100"
        >
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={()=>setDialogOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                WP Music
              </Typography>

            </Toolbar>
          </AppBar>
          <Card sx={{ display: 'flex' }}>
            <CardMedia
              className="p-5"
              component="img"
              sx={{ width: 300 }}
              image="https://images.chinatimes.com/newsphoto/2022-03-01/656/20220301002802.jpg"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: 500}}>
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
                    <Typography className="text-start p-3" variant="h4" >
                      {name}
                    </Typography>
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                {editingDescription ? (
                  <ClickAwayListener onClickAway={handleUpdateDescription}>
                    <Input
                      autoFocus
                      defaultValue={description}
                      className="grow"
                      placeholder="Enter a new description for this list..."
                      sx={{ fontSize: "2rem" }}
                      inputRef={inputRef}
                    />
                  </ClickAwayListener>
                ) : (
                  <button
                    onClick={() => setEditingDescription(true)}
                    className="w-full rounded-md p-2 hover:bg-white/10"
                  >
                    <Typography className="text-start p-3" variant="body2" >
                      {description}
                    </Typography>
                  </button>
                )}
              </div>
              
            </Box>
            
          </Card>
          <AppBar position="static" color = "transparent">
            <Toolbar>
              <div className = "flex space-x-4 absolute bottom-3 right-2" >
                <Button
                  variant="contained"
                  onClick={() => setOpenNewSongDialog(true)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClickOpenDelete}
                >
                  delete
                </Button>
              </div>
            </Toolbar>
          </AppBar>
          <Dialog
            open={deleteOrNot}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"是否確定刪除?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText >
                <Typography>按下確定刪除即刪除以下曲子</Typography> 
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                {songs.map((song)=>(
                  selectedSongs.includes(song.id) ? (
                    <Typography>{song.title}</Typography> 
                  ):(<div/>)
                ))}
              </DialogContentText>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={handleDelete}>確定刪除</Button>
              <Button onClick={handleCloseDelete} autoFocus>
                返回
              </Button>
            </DialogActions>
          </Dialog>
          <SongDialog
            variant="new"
            open={openNewSongDialog}
            onClose={() => setOpenNewSongDialog(false)}
            listId={id}
          />
          <div>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-evenly',
              p: 1,
              borderRadius: 1,
            }}
          >
            <Typography className="w-1/3" align = "left">
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              Song
            </Typography>
            <Typography className="w-1/3" align = "left">Singer</Typography>
            <Typography className="w-1/3" align = "left">Link</Typography>
          </Box>
            <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
            <div className="flex flex-col gap-4">
              {songs.map((song) => (
                <Song key={song.id} {...song} all = {checked} onCheckboxChange={(isChecked:boolean) => handleCheckboxChange(song.id, isChecked)}
                />
              ))}
            </div>
          </div>
          
        </Dialog>
        
        <div className = "text-1xl text-green-500 p-2">{songs.length} song(s)</div>
        <div className = "text-4xl p-2">{name}</div>
        


      </Card>

    </>
  );
}
