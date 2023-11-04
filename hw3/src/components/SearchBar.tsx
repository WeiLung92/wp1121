"use client";

import { useRef } from "react";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import GrowingTextarea from "@/components/GrowingTextarea";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


export default function Search() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    

    const handleSearch = async () => {
        const target = textareaRef.current?.value;
        if (!target){
            const params = new URLSearchParams(searchParams);
            params.set("search", '');
            router.push(`${pathname}?${params.toString()}`);}
        else{
            const params = new URLSearchParams(searchParams);
            params.set("search", textareaRef.current?.value);
            router.push(`${pathname}?${params.toString()}`);
                // this triggers the onInput event on the growing textarea
                // thus triggering the resize
                // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
        };
    }
    
    

  return (
    <Box
    component="form"
    sx={{
      '& .MuiTextField-root': { m: 1, width: '25ch' },
    }}
    noValidate
    autoComplete="off"
    className='flex'
  >
    <div>
      <GrowingTextarea
        ref={textareaRef}
        className="my-2 mx-3 bg-transparent outline placeholder:text-gray-500"
        placeholder="搜尋想參加的活動"
        />
    </div>
    <IconButton aria-label="delete" onClick={handleSearch}>
      <SearchIcon />
    </IconButton>
  </Box>
);
}