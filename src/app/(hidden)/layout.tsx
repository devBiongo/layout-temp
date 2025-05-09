export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div>-------------hiddenlayout---------------</div>
      <div style={{ paddingLeft: 20 }}>{children}</div>
    </div>
  );
}
