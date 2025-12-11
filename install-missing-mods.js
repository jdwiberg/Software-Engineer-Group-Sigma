// file: install-missing-node-modules.js
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const baseDir = path.join(__dirname, "backend", "lib");

function runNpmInstallIfNeeded(dir) {
  const nodeModulesPath = path.join(dir, "node_modules");
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`🛠️  node_modules not found in ${dir}`);
    try {
      execSync("npm install", { cwd: dir, stdio: "inherit" });
      console.log(`✅ npm install completed for ${dir}`);
    } catch (err) {
      console.error(`❌ Error running npm install in ${dir}:`, err.message);
    }
  } else {
    console.log(`✅ node_modules already exists in ${dir}`);
  }
}

function traverseFolders(basePath) {
  const entries = fs.readdirSync(basePath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = path.join(basePath, entry.name);
      // If folder has a package.json, assume it's a Node project
      if (fs.existsSync(path.join(fullPath, "package.json"))) {
        runNpmInstallIfNeeded(fullPath);
      } else {
        // Otherwise, continue searching deeper
        traverseFolders(fullPath);
      }
    }
  }
}

// Run the script
console.log(`🔍 Scanning ${baseDir} for missing node_modules...`);
traverseFolders(baseDir);
console.log("🎉 Done!");