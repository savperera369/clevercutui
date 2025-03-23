import ExpandButton from "@/components/ExpandButton";

const mapModeDescription = "This is the core screen for manual point capture and mesh generation.";
const trimModeDescription = "This page will display the latest saved mesh.";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-1/2 flex items-center justify-center h-full">
            <ExpandButton buttonTitle="MAP Mode" content={mapModeDescription} href={"/map"}/>
        </div>
        <div className="w-1/2 flex items-center justify-center h-full">
            <ExpandButton buttonTitle="Trim Mode" content={trimModeDescription} href={"/trim"}/>
        </div>
    </div>
  );
}
