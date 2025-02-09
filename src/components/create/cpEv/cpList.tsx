"use client";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
const BottomSheet = ({ open, setOpen }) => {
  return (
    <div>
      {/* DRAWER */}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        variant='persistent'
        PaperProps={{
          style: {
            maxWidth: "499px",
            height: "100%",
            marginRight: "auto",
            marginLeft: "1px",
            zIndex: "100",
            overflowY: "hidden",
            backgroundColor: "#64B5F6",
          },
        }}
      >
        <div style={{paddingLeft:20, paddingRight:20}}>
          <div style={{cursor:"pointer", marginTop:"20px"}} onClick={() => {setOpen(false);}} className='cursor-pointer flex justify-center'>
            <img
              src="/svg/arrow.svg"
              alt="Description of image"
              className="cursor-pointer scale-[1] p-2 "
            />
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default BottomSheet;
