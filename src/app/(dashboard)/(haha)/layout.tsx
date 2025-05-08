export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "10px solid black", padding: 20 }}>{children}</div>
  );
}

export const META = { title: "设置管理" };
