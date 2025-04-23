import { Tab, Popover, Box, TabProps } from "@mui/material";
import React, { Fragment, ReactNode, useRef, useState } from "react";

interface HoverTabProps extends Omit<TabProps, "children"> {
  children?: ReactNode;
}

const HoverTab = React.forwardRef<HTMLDivElement, HoverTabProps>(
  ({ children, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const tabRef = ref ?? localRef;
    const [open, setOpen] = useState(false);

    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);

    if (!children) {
      return <Tab {...props} ref={tabRef} />;
    }

    return (
      <Fragment>
        <Tab
          {...props}
          ref={tabRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        <Popover
          aria-hidden={false}
          open={open}
          anchorEl={
            tabRef !== null && typeof tabRef === "object"
              ? tabRef.current
              : null
          }
          onClose={handleMouseLeave}
          disableRestoreFocus
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          slotProps={{
            paper: {
              onMouseEnter: handleMouseEnter,
              onMouseLeave: handleMouseLeave,
              sx: { pointerEvents: "auto" },
            },
          }}
          sx={{ pointerEvents: "none", mt: 1 }}
        >
          <Box>{children}</Box>
        </Popover>
      </Fragment>
    );
  }
);

HoverTab.displayName = "HoverTab";
export default HoverTab;
