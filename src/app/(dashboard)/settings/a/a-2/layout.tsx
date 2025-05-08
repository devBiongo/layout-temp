export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "30px solid pink", padding: 30 }}>{children}</div>
  );
}

export const META = { title: "设置管理aaaa" };
