import Mesh from '../../(models)/mesh'
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, points } = await req.json();
        const newMesh = new Mesh({ name, points });
        await newMesh.save();

        return NextResponse.json({ message: "Mesh created successfully." }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const latestMesh = await Mesh.findOne().sort({ createdAt: -1 });
        return NextResponse.json({ mesh: latestMesh }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}