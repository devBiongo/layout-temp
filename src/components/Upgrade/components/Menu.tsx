import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tabs,
} from "@mui/material";
import { createContext, useContext, useState } from "react";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HoverTab from "./HoverTab";

interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  permission?: string;
  hidden?: boolean;
  external?: boolean;
  disabled?: boolean;
  isRoot?: boolean;
  children?: MenuItem[];
}

export interface MenuProps {
  mode?: string;
  items: MenuItem[];
}

const MenuContext = createContext<{
  rootMenus: MenuItem[] | null;
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
  expandedKeys: Record<string, boolean>;
  setExpandedKeys: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}>({
  rootMenus: null,
  selectedKeys: [],
  setSelectedKeys: () => {},
  expandedKeys: {},
  setExpandedKeys: () => {},
});

function findTreeKeys(tree: MenuItem[], key: string): string[] {
  for (const node of tree) {
    if (node.key === key) return [node.key];
    if (node.children) {
      const path = findTreeKeys(node.children, key);
      if (path.length) return [node.key, ...path];
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
    rootMenus,
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
    <List
      component="div"
      disablePadding
      sx={{
        overflow: "hidden",
        transition: "all 0.3s ease",
        minWidth: "200px",
      }}
    >
      {menuItems.map((item) => {
        const hasChildren = !!item.children?.length;
        const isOpen = expandedKeys[item.key] ?? false;
        const isSelected = selectedKeys.includes(item.key);

        return (
          <React.Fragment key={item.key}>
            <ListItemButton
              onClick={() => {
                if (!hasChildren)
                  setSelectedKeys(findTreeKeys(rootMenus!, item.key));
                if (!item.disabled && hasChildren) handleToggle(item.key);
              }}
              sx={{
                pl: 2 + depth * 2,
                overflow: "hidden",
                transition: "all 0.3s ease",
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
                    color: isSelected ? theme.palette.primary.main : "#667074",
                    minWidth: 30,
                  })}
                >
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                sx={(theme) => ({
                  color: isSelected ? theme.palette.primary.main : "#667074",
                  pr: 2,
                })}
              />
              {hasChildren && (
                <AnimatedExpandIcon
                  open={isOpen}
                  sx={(theme) => ({
                    color: isSelected ? theme.palette.primary.main : "#667074",
                  })}
                />
              )}
            </ListItemButton>
            {hasChildren && (
              <Collapse
                in={isOpen}
                timeout="auto"
                unmountOnExit
                collapsedSize={0}
              >
                <MenuTree menuItems={item.children!} depth={depth + 2} />
              </Collapse>
            )}
          </React.Fragment>
        );
      })}
    </List>
  );
};

export const Menu: React.FC<MenuProps> = ({ items: rootMenus, mode }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["mail"]);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const contextValue = {
    rootMenus,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    setExpandedKeys,
  };

  if (mode !== "horizontal") {
    return (
      <MenuContext.Provider value={contextValue}>
        <MenuTree menuItems={rootMenus} />
      </MenuContext.Provider>
    );
  }

  return (
    <MenuContext.Provider value={contextValue}>
      <Tabs
        value={selectedKeys[0]}
        onChange={(_, value) => {
          if (rootMenus) {
            for (const menuItem of rootMenus) {
              if (value === menuItem.key) {
                if (!menuItem.children) {
                  setSelectedKeys([menuItem.key]);
                }
                return;
              }
            }
          }
        }}
      >
        {rootMenus.map((menuItem) => (
          <HoverTab
            key={menuItem.key}
            value={menuItem.key}
            label={menuItem.label}
          >
            {menuItem.children && <MenuTree menuItems={menuItem.children} />}
          </HoverTab>
        ))}
      </Tabs>
    </MenuContext.Provider>
  );
};
