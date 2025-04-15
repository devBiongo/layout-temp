import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { CustomTab, CustomTabs } from "../../CustomTabs";
import { useState } from "react";

export function Header() {
  const [tab, setTab] = useState(0);
  return (
    <Box
      component={"header"}
      sx={{
        bgcolor: "#fff",
        position: "sticky",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <Box
        sx={(theme) => ({
          boxShadow: 1,
          height: theme.spacing(6),
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        })}
      >
        <Stack direction={"row"} spacing={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={(theme) => ({
              display: "block",
              color: theme.palette.primary.main,
            })}
          >
            URL
          </Typography>
          <TextField
            hiddenLabel
            defaultValue="/contents/10022716/5"
            variant="standard"
            sx={{ width: 400 }}
          />
        </Stack>
        <Stack direction={"row"} spacing={1}>
          <Button variant="contained">OK</Button>
          <Button variant="contained">下書</Button>
          <Button variant="contained">キャンセル</Button>
        </Stack>
      </Box>
      <Box sx={{ boxShadow: 1, px: 1 }}>
        <CustomTabs value={tab} onChange={setTab}>
          <CustomTab label="コンテンツ" index={0} />
          <CustomTab label="属性" index={1} />
          <CustomTab label="カテゴリ" index={2} />
          <CustomTab label="更新履歴" index={3} />
        </CustomTabs>
      </Box>
    </Box>
  );
}
