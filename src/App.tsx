import React from "react";
import FileExplorer from "./components/FileExplorer";

const items: React.ComponentProps<typeof FileExplorer>["items"] = [
  {
    id: "1",
    label: "Documents",
    fileType: "folder",
    children: [
      {
        id: "1.x",
        label: "Company",
        fileType: "folder",
        children: [
          { id: "1.9.1", label: "Invoice", fileType: "folder" },
          { id: "1.1.2", label: "Meeting notes", fileType: "folder" },
          { id: "1.1.3", label: "Tasks list", fileType: "folder" },
          { id: "1.1.4", label: "Equipment", fileType: "folder" },
          { id: "1.1.5", label: "Video conference", fileType: "folder" },
        ],
      },
      { id: "1.2", label: "Personal", fileType: "folder" },
      { id: "1.3", label: "Group photo", fileType: "folder" },
    ],
  },
  {
    id: "2",
    label: "Bookmarked",
    fileType: "folder",
    children: [
      { id: "2.1", label: "Learning materials", fileType: "folder" },
      { id: "2.2", label: "News", fileType: "folder" },
      { id: "2.3", label: "Forums", fileType: "folder" },
      { id: "2.4", label: "Travel documents", fileType: "folder" },
    ],
  },
  { id: "3", label: "History", fileType: "folder" },
  { id: "4", label: "Trash", fileType: "folder" },
];

export function App() {
  return <FileExplorer items={items} />;
}
