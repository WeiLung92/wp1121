import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";


type SHeaderProps = {
  add: React.Dispatch<React.SetStateAction<boolean>>;
  setdeleting: React.Dispatch<React.SetStateAction<boolean>>;
  deleting: boolean;
}

export default function SHeader({add, setdeleting, deleting}:SHeaderProps) {
  return (
    <AppBar position="static" color = "transparent">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My Playlist
        </Typography>
        <div className = "flex space-x-4">
          <Button
              variant="contained"
              className="w-50"
              onClick={()=>add(true)}
              color = "secondary"
              
          >
              Add
          </Button>
          {deleting ?(
            <Button
                variant="contained"
                className="w-50"
                onClick={()=>setdeleting(false)}
                color = "secondary"
            >
                Done
            </Button>
          ):(
            <Button
                variant="contained"
                className="w-50"
                onClick={()=>setdeleting(true)}
                color = "secondary"
            >
                Delete
            </Button>
          )

          }

        </div>
        
      </Toolbar>
    </AppBar>
    
  );
}