import { memo } from 'react';

function EvidenceImagePlaceholder({
  label = 'INSERT CUSTOM CONSPIRACY IMAGE HERE',
  src,
  alt = label,
  variant = 'portrait'
}) {
  return (
    <>
      {/* INSERT CUSTOM CONSPIRACY IMAGE HERE */}
      <figure
        className={[
          'evidence-image-placeholder',
          `evidence-image-placeholder--${variant}`,
          src ? 'has-image' : ''
        ].join(' ')}
      >
        <span className="image-tape image-tape-top" />
        <span className="image-tape image-tape-bottom" />
        <span className="image-pin image-pin-left" />
        <span className="image-pin image-pin-right" />
        {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : null}
        {/* <figcaption>{label}</figcaption> */}
      </figure>
    </>
  );
}

export default memo(EvidenceImagePlaceholder);
