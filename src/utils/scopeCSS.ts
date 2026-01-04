/**
 * Scope CSS to a specific section by prefixing all selectors with the section ID
 * @param css - The CSS string to scope
 * @param sectionId - The unique ID of the section
 * @returns The scoped CSS string
 */
export function scopeCSS(css: string, sectionId: string): string {
  if (!css || !css.trim()) return '';

  const scopeSelector = `[data-section-id="${sectionId}"]`;
  
  // Split CSS into rules
  const rules = css.split('}').filter(rule => rule.trim());
  
  const scopedRules = rules.map(rule => {
    const trimmedRule = rule.trim();
    if (!trimmedRule) return '';
    
    // Find the opening brace
    const braceIndex = trimmedRule.indexOf('{');
    if (braceIndex === -1) return trimmedRule + '}';
    
    // Extract selector and properties
    const selector = trimmedRule.substring(0, braceIndex).trim();
    const properties = trimmedRule.substring(braceIndex);
    
    // Skip @-rules (like @media, @keyframes, etc.)
    if (selector.startsWith('@')) {
      return trimmedRule + '}';
    }
    
    // Split multiple selectors (e.g., "h1, h2, p")
    const selectors = selector.split(',').map(s => s.trim());
    
    // Prefix each selector with the scope
    const scopedSelectors = selectors.map(sel => {
      // If selector is already scoped, don't double-scope
      if (sel.includes(scopeSelector)) return sel;
      
      // Add scope prefix
      return `${scopeSelector} ${sel}`;
    });
    
    return `${scopedSelectors.join(', ')} ${properties}}`;
  });
  
  return scopedRules.join('\n');
}
