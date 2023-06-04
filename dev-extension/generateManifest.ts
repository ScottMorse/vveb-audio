import fs from "fs"
import path from "path"
import packageJson from "./package.json"

if (require.main === module) {
  fs.writeFileSync(
    path.join(process.env.BUILD_DIR ?? "./build", "manifest.json"),
    JSON.stringify(
      {
        manifest_version: 3,
        version: packageJson.version,
        name: "VVeb Audio Developer Extension",
        description:
          "Developer tools for VVeb Audio. Includes user script for the JS console.",
        permissions: ["activeTab", "tabs", "scripting"],
        host_permissions: ["<all_urls>"],
        background: {
          service_worker: "background.js",
        },
        action: {},
        web_accessible_resources: [
          {
            resources: ["userScript.js"],
            matches: ["<all_urls>"],
          },
        ],
      },
      null,
      2
    )
  )
}
