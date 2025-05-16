import { Sidebar } from "@/app/components/sidebar"

export default function Loading() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-8">
        <div className="flex justify-end mb-6">
          <div className="h-10 w-40 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <div>
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 animate-pulse rounded-md mb-8"></div>
        </div>
        <div className="h-[calc(100vh-200px)] bg-gray-200 animate-pulse rounded-lg"></div>
      </main>
    </div>
  )
}
