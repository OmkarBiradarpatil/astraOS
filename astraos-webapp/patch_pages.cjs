const fs = require("fs");
const path = require("path");

const pagesDir = path.join(__dirname, "src", "pages");
const pages = [
  "Dashboard.jsx",
  "Tasks.jsx",
  "Study.jsx",
  "FocusTube.jsx",
  "Vault.jsx",
  "Health.jsx",
  "Entertainment.jsx",
  "Settings.jsx",
];

for (const page of pages) {
  const filePath = path.join(pagesDir, page);
  let content = fs.readFileSync(filePath, "utf8");

  // Skip if already added
  if (content.includes("Loading environment physics...")) continue;

  // Add useAuth if needed, wait, focus only on context and auth errors
  // If it uses useAppContext, check it.
  if (content.match(/const\s+\{.*\}\s*=\s*useAppContext\(\);/)) {
    const contextMatch = content.match(
      /const\s+\{.*\}\s*=\s*useAppContext\(\);/,
    )[0];
    const newContextBody = `const context = useAppContext();
  if (!context) return <div style={{ padding: '40px', color: '#fff' }}>Loading environment physics...</div>;
  ${contextMatch.replace("useAppContext()", "context")}`;
    content = content.replace(contextMatch, newContextBody);
  }

  // Also catch generic errors by adding an Error catch block or just writing the file safely.
  fs.writeFileSync(filePath, content);
  console.log("Patched", page);
}
