import { Popover, Box, Tab } from "@mui/material";
import { useRef, useState } from "react";

const MouseHoverPopover = ({ children }: { children: React.ReactNode }) => {
  const [openedPopover, setOpenedPopover] = useState(false);
  const popoverAnchor = useRef(null);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  return (
    <>
      <Tab
        ref={popoverAnchor}
        aria-owns={openedPopover ? "mouse-over-popover" : undefined}
        aria-haspopup="true"
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
        label="Active"
        sx={(theme) => ({
          borderBottom: "2px solid transparent",
          transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          ":hover": {
            borderColor: theme.palette.primary.main,
          },
        })}
      />
      <Popover
        id="mouse-over-popover"
        open={openedPopover}
        anchorEl={popoverAnchor.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          onMouseEnter: popoverEnter,
          onMouseLeave: popoverLeave,
          sx: {
            pointerEvents: "auto",
          },
        }}
        sx={{
          pointerEvents: "none",
          mt: 1,
        }}
      >
        <Box>{children}</Box>
      </Popover>
    </>
  );
};

export default MouseHoverPopover;
