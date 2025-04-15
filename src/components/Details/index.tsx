import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Header } from "./components/Header";
import Main from "./components/Main";

export default function Details() {
  return (
    <Box sx={{ bgcolor: "#eee", height: "100vh", overflowY: "auto" }}>
      <Header />
      <Box>
        {/* <Box px={3}>
          <Stack direction={"row"} spacing={1}>
            <OutlinedInput
              startAdornment={
                <InputAdornment position="start" sx={{ p: 0 }}>
                  <Box
                    sx={(theme) => ({
                      width: 30,
                      height: "100%",
                      bgcolor: theme.palette.primary.main,
                    })}
                  />
                </InputAdornment>
              }
              sx={{
                p: 0,
                height: 30,
                width: 100,

                "& .MuiInputAdornment-root": {
                  height: "100%",
                },
                bgcolor: "#fff",
              }}
            />
          </Stack>
        </Box> */}
        <Paper sx={{ m: 3, py: 3 }}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            py={1}
            px={3}
            spacing={2}
          >
            <TextField
              sx={{
                flexGrow: 1,
              }}
              defaultValue={"四月リリース検証"}
            />
            <Stack justifyContent={"center"}>
              <Button variant="contained">プレビュー</Button>
            </Stack>
          </Stack>
          <Stack direction={"row"} alignItems={"center"} px={3} mt={3}>
            <Stack sx={{ width: 200 }} justifyContent={"center"}>
              <Typography variant="h6" sx={{ fontSize: 16 }}>
                タイトルキーワード
              </Typography>
              <FormControlLabel control={<Checkbox />} label="ChatGPTを使用" />
            </Stack>
            <TextField
              multiline
              sx={{
                flexGrow: 1,
              }}
              rows={1}
              placeholder="四月リリースの検証結果がPDF形式で更新されました。"
            />
          </Stack>
        </Paper>
        <Paper sx={{ m: 3 }}>
          <Main />
        </Paper>
      </Box>
    </Box>
  );
}
