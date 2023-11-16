import FreelancerNavbar from "@/components/nav/FreelancerNavbar"

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full overflow-auto">
      <div className="h-[70px] bg-blue-500 flex items-center">
        <nav className="max-w-screen-lg w-full mx-auto flex justify-between items-center px-4">
          <h1 className="font-extrabold text-2xl">GYC</h1>

          <FreelancerNavbar />
        </nav>
      </div>

      <div className="mx-auto min-h-[calc(100vh-70px)] w-full max-w-screen-lg">{children}</div>
    </main>
  )
}
