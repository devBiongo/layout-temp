export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "2px solid blue", padding: 20 }}>{children}</div>
  );
}

// type MenuItem = {
//   title: string;
//   path: string;
//   disabled?: boolean;
//   children?: MenuItem[];
// };

// const MenuList: React.FC<{ items: MenuItem[] }> = ({ items }) => {
//   const navigate = useNavigate();

//   const handleClick = (path: string) => {
//     navigate(path, { replace: true });
//   };

//   return (
//     <ul>
//       {items.map((item) => (
//         <li key={item.path} style={{ margin: 3 }}>
//           <button
//             onClick={() => handleClick(item.path)}
//             style={{ cursor: "pointer" }}
//             disabled={item.disabled}
//           >
//             {item.title}
//           </button>
//           {item.children && item.children.length > 0 && (
//             <MenuList items={item.children} />
//           )}
//         </li>
//       ))}
//     </ul>
//   );
// };
