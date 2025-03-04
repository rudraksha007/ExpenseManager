export async function generateStaticParams() {
  // Fetch or define project IDs that should be statically generated
  const projects = [{ id: "1" }, { id: "2" }, { id: "3" }]; // Replace with actual IDs

  return projects.map((project) => ({
    id: project.id.toString(),
  }));
}
