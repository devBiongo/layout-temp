import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import { Editor } from "./Editor";

export default function Main() {
  return (
    <Stack sx={{ bgcolor: "#fff", boxShadow: 1, p: 1, px: 3 }} spacing={2}>
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            概要文
          </Typography>
          <FormControlLabel control={<Checkbox />} label="ChatGPTを使用" />
        </Stack>
        <TextField
          multiline
          sx={{ flexGrow: 1 }}
          rows={1}
          placeholder="四月リリースの検証結果がPDF形式で更新されました。"
        />
      </Stack>
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            キーワード
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
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            目次
          </Typography>
        </Stack>
        <TextField
          multiline
          sx={{
            flexGrow: 1,
          }}
          rows={1}
        />
      </Stack>
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            関連
          </Typography>
        </Stack>
        <TextField
          multiline
          sx={{
            flexGrow: 1,
          }}
          rows={1}
        />
      </Stack>
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            公式サイト
          </Typography>
        </Stack>
        <TextField
          multiline
          sx={{
            flexGrow: 1,
          }}
          rows={1}
        />
      </Stack>
      <Stack direction={"row"} alignItems={"center"}>
        <Stack sx={{ width: 200 }} justifyContent={"center"}>
          <Typography variant="h6" sx={{ fontSize: 16 }}>
            手動コメント
          </Typography>
        </Stack>
        <TextField
          multiline
          sx={{
            flexGrow: 1,
          }}
          rows={1}
        />
      </Stack>

      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={1}
        sx={{ transform: "translateX(-10px)" }}
      >
        <FormControlLabel control={<Checkbox />} label="検索対象" />
        <HelpIcon fontSize="small" />
        <FormControlLabel control={<Checkbox />} label="タブ更新日時そのまま" />
        <HelpIcon fontSize="small" />
        <FormControlLabel control={<Checkbox />} label="NDAフラグ" />
        <HelpIcon fontSize="small" />
        <FormControlLabel control={<Checkbox />} label="店頭非公開" />
        <HelpIcon fontSize="small" />
      </Stack>
      <Box height={550}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          py={1}
        >
          <Stack direction={"row"} spacing={3} alignItems={"center"}>
            <Typography>タブ更新日時:</Typography>
            <TextField
              type="datetime-local"
              variant="standard"
              defaultValue={Date.now()}
            />
          </Stack>
          <Stack direction={"row"} spacing={1}>
            <Button variant="contained">表示切替</Button>
            <Button variant="contained">比較</Button>
            <Button variant="contained">ファイル挿入</Button>
          </Stack>
        </Stack>
        <Editor />
      </Box>
    </Stack>
  );
}
