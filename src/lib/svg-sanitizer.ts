import DOMPurify from 'dompurify';

/**
 * Sanitizes SVG content to prevent XSS attacks.
 * Uses DOMPurify with strict SVG-specific configuration.
 * 
 * This should be used whenever rendering SVG content from the database
 * or any untrusted source.
 */
export function sanitizeSvg(svgContent: string): string {
  if (!svgContent) return '';
  
  return DOMPurify.sanitize(svgContent, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_TAGS: ['use', 'defs', 'pattern', 'clipPath', 'mask', 'marker', 'linearGradient', 'radialGradient', 'stop'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'foreignObject', 'form', 'input', 'button'],
    FORBID_ATTR: [
      'onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 
      'onmouseenter', 'onmouseleave', 'onfocus', 'onblur', 'onchange',
      'onanimationend', 'onanimationstart', 'onanimationiteration',
      'ontransitionend', 'ontransitionstart', 'onscroll', 'onwheel',
      'onkeydown', 'onkeyup', 'onkeypress', 'ondrag', 'ondrop',
      'formaction', 'xlink:href'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });
}
