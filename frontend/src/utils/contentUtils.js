export function stripHtml(html) {
  // Create a temporary element
  const temp = document.createElement("div");
  // Set the HTML content
  temp.innerHTML = html;
  // Get the text content
  let text = temp.textContent || temp.innerText;
  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}
