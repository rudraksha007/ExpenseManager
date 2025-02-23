import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json(); // Parse JSON request body
      const { name, email } = body;
  
      if (!name || !email) {
        return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
      }
  
      return new Response(JSON.stringify({ message: `User ${name} with email ${email} added!` }), {
        status: 201,
      });
    } catch (error) {
      return new Response(JSON.stringify({ message: "Error processing request" }), { status: 500 });
    }
  }
  