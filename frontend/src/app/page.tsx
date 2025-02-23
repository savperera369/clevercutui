import ExpandButton from "@/components/ExpandButton";

const mapModeDescription = "This is the core screen for manual point capture and mesh generation.";
const trimModeDescription = "This page will display the latest saved mesh.";

export default function Home() {
  return (
    <div className="px-4 py-4 flex items-center justify-center min-h-screen">
      <div className="w-1/2 bg-gray-100 rounded-md shadow-md px-8 py-8 flex flex-col gap-2 items-center">
          <p className="text-xl font-semibold">Select a Mode</p>
          <div className="w-full flex flex-col items-center justify-center gap-y-1">
              <ExpandButton buttonTitle="MAP Mode" content={mapModeDescription} href={"/map"}/>
              <ExpandButton buttonTitle="Trim Mode" content={trimModeDescription} href={"/trim"}/>
          </div>
      </div>
    </div>
  );
}
