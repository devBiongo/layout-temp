import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Box, Button, Popover } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MenuContext } from "./MenuTree";

const TabsContext = createContext<{
  value: number;
  registerTab: (index: number, el: HTMLDivElement | null) => void;
}>({
  value: 0,

  registerTab: () => {},
});

export const CustomTabs = ({
  value,
  children,
}: {
  value: number;
  children: React.ReactNode;
}) => {
  const tabsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const registerTab = (index: number, el: HTMLDivElement | null) => {
    tabsRef.current[index] = el;
  };

  useEffect(() => {
    const currentEl = tabsRef.current[value];
    if (currentEl) {
      const { offsetLeft, clientWidth } = currentEl;
      setIndicatorStyle({ left: offsetLeft, width: clientWidth });
    }
  }, [value, children]);

  return (
    <TabsContext.Provider value={{ value, registerTab }}>
      <Box position="relative" display="flex" gap={3}>
        {children}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            height: "2px",
            bgcolor: "#1976d2",
            transition: "all 0.3s ease",
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </Box>
    </TabsContext.Provider>
  );
};

export const CustomTab = ({
  label,
  index,
  children,
  icon,
  id,
}: {
  label: React.ReactNode;
  index: number;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  id: string;
}) => {
  const { value, registerTab } = useContext(TabsContext);

  const { setSelectedKeys } = useContext(MenuContext);

  const isActive = index === value;
  const [openedPopover, setOpenedPopover] = useState(false);
  const popoverAnchor = useRef(null);

  const popoverEnter = () => {
    setOpenedPopover(true);
  };

  const popoverLeave = () => {
    setOpenedPopover(false);
  };

  useEffect(() => {
    registerTab(index, popoverAnchor.current);
  }, [index, registerTab]);

  if (!children) {
    return (
      <Button
        ref={popoverAnchor}
        size="large"
        sx={(theme) => ({
          color: isActive ? theme.palette.primary.main : "black",
        })}
        startIcon={icon}
        onClick={() => {
          setSelectedKeys([id]);
        }}
      >
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button
        endIcon={
          <ExpandMoreIcon
            fontSize="small"
            sx={{
              transform: openedPopover ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        }
        ref={popoverAnchor}
        onMouseEnter={popoverEnter}
        onMouseLeave={popoverLeave}
        startIcon={icon}
        size="large"
        sx={(theme) => ({
          color: isActive ? theme.palette.primary.main : "black",
        })}
      >
        {label}
      </Button>
      <Popover
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
        slotProps={{
          paper: {
            onMouseEnter: popoverEnter,
            onMouseLeave: popoverLeave,
            sx: {
              pointerEvents: "auto",
            },
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
