/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param {string} html
 * @returns {string}
 */
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  const scriptTags = tempElement.getElementsByTagName('script');
  for (let i = scriptTags.length - 1; i >= 0; i--) {
    scriptTags[i].parentNode.removeChild(scriptTags[i]);
  }
  
  const allElements = tempElement.getElementsByTagName('*');
  for (let i = 0; i < allElements.length; i++) {
    const attributes = allElements[i].attributes;
    for (let j = attributes.length - 1; j >= 0; j--) {
      const name = attributes[j].name;
      if (name.startsWith('on') || name === 'href' && attributes[j].value.startsWith('javascript:')) {
        allElements[i].removeAttribute(name);
      }
    }
  }
  
  return tempElement.innerHTML;
};

/**
 * Checks if HTML content is effectively empty (only contains empty paragraphs, breaks, etc.)
 * @param {string} html
 * @returns {boolean} 
 */
export const isHtmlEmpty = (html) => {
  if (!html) return true;
  
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  const text = tempElement.textContent || tempElement.innerText || '';
  
  return text.trim().length === 0;
};

/**
 * Cleans RichTextEditor content by removing unnecessary empty paragraphs
 * and normalizing the content to a single paragraph if it only contains whitespace
 * @param {string} html
 * @returns {string}
 */
export const cleanRichTextContent = (html) => {
  if (!html) return '';

  let cleaned = html.replace(/(<p><br><\/p>)+/g, '<p><br></p>');
  cleaned = cleaned.replace(/^(<p><br><\/p>)+/g, '');
  cleaned = cleaned.replace(/(<p><br><\/p>)+$/g, '');
  
  if (isHtmlEmpty(cleaned)) {
    return '<p><br></p>';
  }
  
  return cleaned;
}; 