export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid black", padding: 20 }}>{children}</div>
  );
}
