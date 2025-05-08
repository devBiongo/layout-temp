export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid green", padding: 20 }}>{children}</div>
  );
}

export const META = { title: "设置管理" };
