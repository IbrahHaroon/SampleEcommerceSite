const modules = import.meta.glob("../assets/media/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : value ?? "";

const formatKey = (value = "") =>
  normalizeString(value)
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const imageMap = Object.entries(modules).reduce((acc, [path, module]) => {
  const filename = path.split("/").pop() || "";
  const key = formatKey(filename.replace(/\.[^.]+$/, ""));
  if (key) acc[key] = module;
  return acc;
}, {});

const FALLBACK_IMAGE = new URL("../assets/react.svg", import.meta.url).href;

export function resolvePerfumeImage(perfume) {
  if (!perfume) return FALLBACK_IMAGE;

  const name = normalizeString(perfume.name);
  const brand = normalizeString(perfume.brand);

  const candidates = [
    perfume.image_key,
    perfume.image,
    perfume.image_filename,
    perfume.imageUrl,
    perfume.slug,
    `${name}_${brand}`,
    `${name}-${brand}`,
    `${brand}-${name}`,
    name,
    brand,
  ]
    .filter(Boolean)
    .map(formatKey);

  for (const candidate of candidates) {
    if (candidate && imageMap[candidate]) {
      return imageMap[candidate];
    }
  }

  return FALLBACK_IMAGE;
}
