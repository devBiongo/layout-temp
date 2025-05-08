export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "5px solid pink", padding: 20 }}>{children}</div>
  );
}
