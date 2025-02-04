

export default function Home() {
  return (
    <div className="px-4 py-4 flex items-center justify-center min-h-screen">
      <div className="bg-gray-100 rounded-md shadow-md px-8 py-8 flex flex-col gap-4 items-center">
          <p className="text-xl font-semibold">Select a Mode</p>
          <div className="flex items-center justify-center gap-x-4">
              <button className="px-4 py-4 rounded-lg text-sm bg-blue-500 text-white transition-all hover:bg-blue-700">MAP Mode</button>
              <button className="px-4 py-4 rounded-lg text-sm bg-blue-500 text-white transition-all hover:bg-blue-700">TRIM Mode</button>
          </div>
      </div>
    </div>
  );
}
