import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
} from "@mui/material";
import React, { createContext, useContext } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface RootMenu {
  permission?: string;
  hidden?: boolean;
  external?: boolean;
  disabled?: boolean;
  isRoot?: boolean;
  children?: MenuItem[];
}

export interface MenuItem extends RootMenu {
  id: string;
  name: string;
  icon?: string;
  path?: string;
}

export const MenuContext = createContext<{
  rootMenu: RootMenu | null;
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  expandedKeys: Record<string, boolean>;
  setExpandedKeys: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}>({
  rootMenu: null,
  selectedKeys: [],
  setSelectedKeys: () => {},
  expandedKeys: {},
  setExpandedKeys: () => {},
});

function findTreeKeys(tree: MenuItem[], key: string): string[] {
  for (const node of tree) {
    if (node.id === key) return [node.id];
    if (node.children) {
      const path = findTreeKeys(node.children, key);
      if (path.length) return [node.id, ...path];
    }
  }
  return [];
}

const AnimatedExpandIcon = styled(ExpandMoreIcon)<{ open: boolean }>(
  ({ open }) => ({
    transition: "transform 0.3s ease",
    transform: open ? "rotate(180deg)" : "rotate(0deg)",
  })
);

export const MenuTree: React.FC<{
  menuItems: MenuItem[];
  depth?: number;
}> = ({ menuItems, depth = 0 }) => {
  const {
    rootMenu,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    setExpandedKeys,
  } = useContext(MenuContext);

  const handleToggle = (key: React.Key) => {
    setExpandedKeys({
      ...expandedKeys,
      [String(key)]: !expandedKeys[String(key)],
    });
  };

  return (
    <List component="div" disablePadding>
      {menuItems.map((item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = expandedKeys[item.id] ?? false;
        const isSelected = selectedKeys.includes(item.id);

        return (
          <React.Fragment key={item.id}>
            <ListItemButton
              onClick={() => {
                if (!hasChildren)
                  setSelectedKeys(findTreeKeys(rootMenu!.children!, item.id));
                if (!item.disabled && hasChildren) handleToggle(item.id);
              }}
              sx={{
                pl: 2 + depth * 2,
                ...(item.disabled && {
                  color: "gray",
                  opacity: 0.5,
                  pointerEvents: "none",
                }),
              }}
              selected={!hasChildren && isSelected}
            >
              {item.icon && (
                <ListItemIcon
                  sx={(theme) => ({
                    color: isSelected ? theme.palette.primary.main : "black",
                    minWidth: 30,
                  })}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.name}
                sx={(theme) => ({
                  color: isSelected ? theme.palette.primary.main : "black",
                  pr: 2,
                })}
              />
              {hasChildren && (
                <AnimatedExpandIcon
                  open={isOpen}
                  sx={(theme) => ({
                    color: isSelected ? theme.palette.primary.main : "black",
                  })}
                />
              )}
            </ListItemButton>
            {hasChildren && (
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <MenuTree menuItems={item.children!} depth={depth + 2} />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};
