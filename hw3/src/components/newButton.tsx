'use client'
import { useRef } from "react";
import { useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField'
import useTweet from "@/hooks/useTweet";
import useUserInfo from "@/hooks/useUserInfo";
import GrowingTextarea from "@/components/GrowingTextarea";
import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/db";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000 rounded-md',
    boxShadow: 24,
    p: 4,
  };
  

export default () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const router = useRouter();
    const today = new Date();

    const { handle } = useUserInfo();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { postTweet, loading } = useTweet();

    const [end, setEnd] = useState<Dayjs | null>(null);
    const endAt = end?.year().toString() + "-" + (end == null ? 'null' : end?.month()+1).toString() + "-" + end?.date().toString() + " " + end?.hour().toString();
    const [start, setStart] = useState<Dayjs | null>(null);
    const startAt = start?.year().toString() + "-" + (start == null ? 'null' : start?.month()+1).toString() + "-" + start?.date().toString() + " " + start?.hour().toString();
    const handleTweet = async () => {
      
      const content = textareaRef.current?.value; 
      if (!content) return;
      if (!handle) return;

      if (end === null || start === null)
      {
        return;
      }
      else
      {
        if((end.toDate().getTime() - start.toDate().getTime() > 7*24*60*60*1000) || end.toDate().getTime() - start.toDate().getTime() < 0)
        {
          alert("開始時間晚於結束時間 or 開始與結束時間相差超過 7 天");
          return;
        }
      }

      try {
        await postTweet({
          handle,
          content,
          endAt,
          startAt,
        });
        textareaRef.current.value = "";
        // this triggers the onInput event on the growing textarea
        // thus triggering the resize
        // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
        textareaRef.current.dispatchEvent(
          new Event("input", { bubbles: true, composed: true }),
        );
      } catch (e) {
        console.error(e);
        alert("Error posting tweet");
      }
      handleClose();
    };

    return(
      <>
        <Button className="w-11 rounded "
          onClick={handleOpen}>新增</Button>
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        >
          <Fade in={open}>
            <Box sx={style}>
            <div className='flex'>
              <div className="mb-2 mt-6">
                <GrowingTextarea
                  ref={textareaRef}
                  className="border-solid border-2 rounded-md placeholder:text-gray-500"
                  placeholder="標題"
                />
              </div>
              <Button onClick={handleTweet}>
                新增
              </Button>
            </div>
            <div className='flex'>
              <div> 
                <div>From</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker format="YYYY-MM-DD hh " ampm={false} views={['year', 'month', 'day', 'hours']} value = {start} onChange={(newValue) => setStart(newValue)}/>
                </LocalizationProvider>
              </div>
              <div> 
                <div>To</div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker format="YYYY-MM-DD hh " ampm={false} views={['year', 'month', 'day', 'hours']} value = {end} onChange={(newValue) => setEnd(newValue)}/>
                </LocalizationProvider>
              </div>
            </div>
            </Box>
          </Fade>
        </Modal>
      </>
    )
  }