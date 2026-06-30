function pickProjectUrl(project) {
  const liveLink = project.detail?.links?.find((item) => item.type === "live");
  if (liveLink?.href && !/example\.com/i.test(liveLink.href)) return liveLink.href;

  const githubLink = project.detail?.links?.find((item) => item.type === "github");
  if (githubLink?.href) return githubLink.href;

  return project.hoverCta?.href || project.github?.href || "";
}

export function projectToCreativeWork(project) {
  return {
    "@type": "CreativeWork",
    name: project.titleLong || project.title,
    url: pickProjectUrl(project),
    description: project.detail?.summary || project.hoverValue || "",
  };
}

export function buildPersonJsonLd(profile, projects) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.alternateName,
    url: profile.siteUrl,
    jobTitle: profile.jobTitle,
    sameAs: profile.sameAs,
    hasPart: projects.map(projectToCreativeWork),
  };
}

export function injectJsonLd(jsonLd, doc = document) {
  let node = doc.getElementById("structuredData");
  if (!node) {
    node = doc.createElement("script");
    node.type = "application/ld+json";
    node.id = "structuredData";
    doc.head.appendChild(node);
  }
  node.textContent = JSON.stringify(jsonLd, null, 2);
}
