import { Box } from "@mui/material";

export function Header() {
  return (
    <Box
      component={"header"}
      boxShadow={1}
      height={60}
      position={"sticky"}
    ></Box>
  );
}
