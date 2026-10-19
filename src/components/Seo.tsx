import { useEffect } from "react"
import { siteMetadata } from "../data/site"

type SeoProps = {
  title?: string
  description?: string
  path?: string
  type?: "website" | "article"
}

function setMeta(
  selector: string,
  attribute: "name" | "property",
  value: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute(attribute, selector.match(/["'](.+)["']/)?.[1] ?? "")
    document.head.appendChild(element)
  }
  element.content = value
}

export function Seo({
  title = siteMetadata.title,
  description = siteMetadata.description,
  path = "/",
  type = "website",
}: SeoProps) {
  useEffect(() => {
    const canonicalUrl = new URL(path, siteMetadata.canonicalOrigin).toString()
    const socialImageUrl = new URL(
      siteMetadata.socialImage,
      siteMetadata.canonicalOrigin,
    ).toString()
    document.title = title

    setMeta('meta[name="description"]', "name", description)
    setMeta('meta[property="og:title"]', "property", title)
    setMeta('meta[property="og:description"]', "property", description)
    setMeta('meta[property="og:type"]', "property", type)
    setMeta('meta[property="og:url"]', "property", canonicalUrl)
    setMeta('meta[property="og:image"]', "property", socialImageUrl)
    setMeta('meta[name="twitter:card"]', "name", "summary_large_image")
    setMeta('meta[name="twitter:title"]', "name", title)
    setMeta('meta[name="twitter:description"]', "name", description)
    setMeta('meta[name="twitter:image"]', "name", socialImageUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl
  }, [description, path, title, type])

  return null
}
