import "./style.css";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

Fancybox.bind("[data-fancybox]");

const alert = document.getElementById("alert") as HTMLDialogElement;

async function handleDownload() {
  const response = await fetch(
    "https://api.github.com/repos/YTLitePlus/YTLitePlus/releases/latest",
  );
  const json = await response.json();

  const match = json.body.match(/### Catbox\s*`(.+?\.ipa)`/);
  if (match && match[1]) {
    const fileName = match[1];
    const downloadUrl = `https://files.catbox.moe/${fileName}`;
    window.location.href = downloadUrl;
  } else {
    alert.showModal();
  }
}

// Handle /download route or #download hash
if (
  window.location.pathname === "/download" ||
  window.location.hash === "#download"
) {
  handleDownload();
}

// Regular download button click handler
document
  .getElementById("downloadIpa")!
  .addEventListener("click", handleDownload);

const classes = document.documentElement.classList;

if (localStorage.getItem("theme") === null)
  localStorage.setItem("theme", "dark");
if (localStorage.getItem("theme") === "light") classes.remove("dark");

document.getElementById("themeToggle")!.addEventListener("click", () => {
  if (classes.contains("dark")) {
    localStorage.setItem("theme", "light");
    classes.remove("dark");
  } else {
    localStorage.setItem("theme", "dark");
    classes.add("dark");
  }
});
