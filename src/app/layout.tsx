export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>-------------layout---------------</div>
      <div style={{ paddingLeft: 20 }}>{children}</div>
    </div>
  );
}
