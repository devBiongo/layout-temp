export default function Layout({ children }: { children: React.ReactNode }) {
  return <div style={{ border: "2px solid red", padding: 20 }}>{children}</div>;
}

export const META = {
  title: "权限管理",
};
