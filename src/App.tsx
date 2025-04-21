import { Box, Button, Stack } from "@mui/material";
import { Menu, MenuProps } from "./components/Menu";
import { CommonTable } from "./components/CommonTable";

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Navigation One",
    key: "mail",
  },
  {
    label: "Navigation Two",
    key: "app",
    disabled: true,
  },
  {
    label: "Navigation Three - Submenu",
    key: "SubMenu",

    children: [
      {
        key: "aaaa",
        label: "Item 1",
        children: [
          { label: "Option 1", key: "setting:1" },
          { label: "Option 2", key: "setting:2" },
        ],
      },
      {
        key: "bbbbb",
        label: "Item 2",
        children: [
          { label: "Option 3", key: "setting:3" },
          { label: "Option 4", key: "setting:4" },
        ],
      },
    ],
  },
  {
    key: "bb213bbb",
    label: "setting:3",
  },
];

const data = [
  { id: 1, name: "Cupcake", calories: 305 },
  { id: 2, name: "Donut", calories: 452 },
  { id: 3, name: "Eclair", calories: 262 },
];

export function App() {
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
        <Menu items={items} />
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
            <Menu mode="horizontal" items={items} />
          </Box>
          <Box component={"main"} mt={2}>
            <CommonTable
              rows={data}
              rowKey="id"
              checkboxSelection
              columns={[
                { key: "name", label: "名称" },
                { key: "calories", label: "卡路里", numeric: true },
                {
                  numeric: true,
                  label() {
                    return <Box pr={3}>操作</Box>;
                  },
                  render(row) {
                    return (
                      <Button onClick={() => alert(row.name)}>编辑</Button>
                    );
                  },
                },
              ]}
            />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
