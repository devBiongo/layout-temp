export default function Layout({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "yellow", minHeight: 500 }}>{children}</div>;
}

export const META = { title: "设置管理" };
