import { useMemo, useState } from "react";
import { MenuContext, MenuItem, MenuTree, RootMenu } from "./MenuTree";

import { CustomTab, CustomTabs } from "./CustomTabs";

type Props = {
  rootMenu: RootMenu;
  isTopMenu?: boolean;
};

const getTabIndex = (selected: string, items: MenuItem[]): number => {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.id === selected) return i;
    if (item.children && containsInTree(item.children, selected)) return i;
  }
  return 0;
};

const containsInTree = (items: MenuItem[], targetId: string): boolean => {
  return items.some(
    (item) =>
      item.id === targetId ||
      (item.children && containsInTree(item.children, targetId))
  );
};

export default function MenuList({ rootMenu, isTopMenu = false }: Props) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const tabIndex = useMemo(() => {
    if (!isTopMenu || !selectedKeys.length) return 0;
    return getTabIndex(selectedKeys[0], rootMenu.children ?? []);
  }, [isTopMenu, selectedKeys, rootMenu.children]);

  const contextValue = {
    rootMenu,
    selectedKeys,
    setSelectedKeys,
    expandedKeys,
    setExpandedKeys,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {isTopMenu ? (
        <CustomTabs value={tabIndex}>
          {rootMenu.children?.map((menuItem, index) => (
            <CustomTab
              key={menuItem.id}
              label={menuItem.name}
              index={index}
              id={menuItem.id}
            >
              {menuItem.children && <MenuTree menuItems={menuItem.children} />}
            </CustomTab>
          ))}
        </CustomTabs>
      ) : (
        <MenuTree menuItems={rootMenu.children ?? []} />
      )}
    </MenuContext.Provider>
  );
}
