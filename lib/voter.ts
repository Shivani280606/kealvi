export function getVoterId(): string {
  if (typeof window === "undefined") {
    // server-safe fallback (temporary)
    return "server";
  }

  let id = localStorage.getItem("voter_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("voter_id", id);
  }

  return id;
}