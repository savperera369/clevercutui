import ExpandButton from "@/components/ExpandButton";

const mapModeDescription = "This is the core screen for manual point capture and mesh generation.";
const trimModeDescription = "This page will display the latest saved mesh.";

export default function Home() {
  return (
    <div className="flex flex-col w-screen gap-y-2 p-2 bg-black min-h-screen">
        <h1 className="font-bold text-center text-white text-5xl mt-4">CleverCut UI</h1>
        <div className="flex items-center justify-center h-full p-2">
            <div className="w-1/2 flex items-center justify-center h-full">
                <ExpandButton buttonTitle="MAP Mode" content={mapModeDescription} href={"/map"}/>
            </div>
            <div className="w-[1px] border border-white h-screen mt-2"></div>
            <div className="w-1/2 flex items-center justify-center h-full">
                <ExpandButton buttonTitle="Trim Mode" content={trimModeDescription} href={"/trim"}/>
            </div>
        </div>
    </div>
  );
}
