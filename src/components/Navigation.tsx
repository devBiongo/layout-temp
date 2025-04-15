import { Box } from "@mui/material";

import { useState } from "react";

import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { CustomTab, CustomTabs } from "./CustomTabs";
import NestedList from "./NestedList";

function Header() {
  const [tab, setTab] = useState(0);
  return (
    <Box>
      <Box component={"header"} sx={{ boxShadow: 1, pl: 2 }}>
        <CustomTabs value={tab} onChange={setTab}>
          <CustomTab
            label="Active"
            index={0}
            icon={<MailOutlineIcon />}
          ></CustomTab>
          <CustomTab label="Active" index={1} icon={<SettingsIcon />} />
          <CustomTab label="Active" index={2} icon={<CelebrationIcon />}>
            <NestedList />
          </CustomTab>
        </CustomTabs>
      </Box>
      <Box></Box>
    </Box>
  );
}

export default Header;
