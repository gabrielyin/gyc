export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full overflow-auto">
      <div className="mx-auto h-full w-full max-w-screen-lg">{children}</div>
    </main>
  )
}
