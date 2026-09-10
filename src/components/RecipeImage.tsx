import { useState } from 'react'

interface Props {
  src?: string
  alt: string
  className?: string
}

/** Renders nothing if there is no src or the file is missing —
 *  callers always keep the gradient behind, so the card never breaks. */
export function RecipeImage({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
