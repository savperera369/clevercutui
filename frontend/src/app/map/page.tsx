import ThreeDMesh from "@/components/ThreeDMesh";

const MapModePage = () => {
    return (
        <div className="p-8 min-h-screen flex flex-col items-center gap-y-2 mt-4">
            <h2 className="text-center font-bold text-2xl mb-4">MAP Mode</h2>
            <div className="flex items-start justify-center gap-x-4 w-full mt-4">
                <div className="flex flex-col items-center border border-black rounded-md bg-gray-100 shadow-md p-4 w-1/2 max-h-1/2">
                    <p className="font-semibold text-xl mb-4">
                        3D Mesh Visualization
                    </p>
                    <div className="w-full rounded-md h-full">
                        <ThreeDMesh />
                    </div>
                </div>
                <div className="border border-black rounded-md bg-gray-100 shadow-md p-4 w-1/2 max-h-1/2">
                    <p className="text-center font-semibold text-xl">
                        Manual Point Capture
                    </p>
                    <div className="flex flex-col items-center p-4 gap-y-4 mt-2">
                        <input className="border-none bg-white p-4 text-sm w-1/2 rounded-md mb-2" type="text" placeholder="Add Coordinates of a Point"/>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900">
                            Add Point
                        </button>
                        <p className="text-sm font-medium mb-4">Plot a point at the current position of the clippers.</p>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900">
                            Undo
                        </button>
                        <p className="text-sm font-medium mb-4">Remove the last plotted point.</p>
                        <button className="w-1/2 px-4 py-4 rounded-lg text-md font-medium bg-gray-500 text-white transition-all hover:bg-gray-900">
                            Reset
                        </button>
                        <p className="text-sm font-medium mb-4">Clear Mesh.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapModePage;