export function stripHtml(html) {
  if (!html) return "";

  const temp = document.createElement("div");
  temp.innerHTML = html;

  const brElements = temp.getElementsByTagName("br");
  for (const br of Array.from(brElements)) {
    br.replaceWith("\n");
  }

  const blockElements = temp.querySelectorAll(
    "p, div, h1, h2, h3, h4, h5, h6, pre"
  );
  for (const block of Array.from(blockElements)) {
    block.innerHTML = "\n" + block.innerHTML + "\n";
  }

  let text = temp.textContent || temp.innerText || "";

  text = text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  return text;
}
