import { Box, Stack } from "@mui/material";

import MenuList from "./components/MenuList";

const rootMenu = {
  id: "0",
  name: "root",
  children: [
    {
      id: "1",
      name: "コンテンツ管理",
    },
    {
      id: "2",
      name: "編集管理",
      disabled: false,
    },
    {
      id: "3",
      name: "設定管理",
      children: [
        { id: "4", name: "Drafts", disabled: true },
        {
          id: "5",
          name: "Starred",
          children: [
            { id: "6", name: "Sub Star 1" },
            {
              id: "7",
              name: "Sub Star 2",
            },
          ],
        },
      ],
    },
  ],
};

export function Upgrade() {
  return (
    <Stack direction="row">
      <Box
        sx={(theme) => ({
          width: theme.spacing(30),
          position: "sticky",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 1,
          boxShadow: 1,
          bgcolor: "background.paper",
        })}
      >
        <MenuList rootMenu={rootMenu} />
      </Box>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          height: "100vh",
          padding: 2,
        }}
      >
        <Box height="2000px">
          <Box component={"header"} boxShadow={1}>
            <MenuList rootMenu={rootMenu} isTopMenu={true} />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
