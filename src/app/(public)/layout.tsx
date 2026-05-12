export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { background-color: #ffffff !important; }`}</style>
      {children}
    </>
  )
}
