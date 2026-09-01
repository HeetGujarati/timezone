const fs = require('fs');
const path = require('path');

const pagesDir = 'd:\\Time Zone website\\Timezone\\src\\content\\pages';

const formHtml = `<form action="https://formsubmit.co/support@yourworldtime.com" method="POST" class="contact-form" style="display: flex; flex-direction: column; gap: 1rem; max-width: 500px; margin-top: 1.5rem; margin-bottom: 2rem;">
  <input type="text" name="_honey" style="display:none">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_next" value="https://yourworldtime.com/">
  
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <label for="name" style="font-weight: 500;">Name</label>
    <input type="text" id="name" name="name" required style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background-color: #fff;">
  </div>
  
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <label for="email" style="font-weight: 500;">Email</label>
    <input type="email" id="email" name="email" required style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background-color: #fff;">
  </div>
  
  <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <label for="message" style="font-weight: 500;">Message</label>
    <textarea id="message" name="message" required rows="5" style="padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem; background-color: #fff; resize: vertical;"></textarea>
  </div>
  
  <button type="submit" style="padding: 0.75rem 1.5rem; background-color: #0f172a; color: #fff; border: none; border-radius: 0.375rem; font-weight: 600; font-size: 1rem; cursor: pointer; align-self: flex-start; transition: background-color 0.2s;">Send Message</button>
</form>`;

function updateContactFiles() {
  const locales = fs.readdirSync(pagesDir);
  let updatedCount = 0;

  for (const locale of locales) {
    const localeDir = path.join(pagesDir, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;

    const contactFile = path.join(localeDir, 'contact.md');
    if (fs.existsSync(contactFile)) {
      let content = fs.readFileSync(contactFile, 'utf8');
      
      // We know the paragraph is after the first frontmatter block.
      // E.g.
      // ---
      // ...
      // ---
      //
      // [Paragraph to replace]
      //
      // ## ...
      
      const parts = content.split('---');
      if (parts.length >= 3) {
        // parts[0] is empty, parts[1] is frontmatter, parts[2] is the body
        let body = parts[2].trimStart();
        
        // Find the first paragraph (up to the first double newline)
        const firstDoubleNewlineIdx = body.indexOf('\n\n');
        
        if (firstDoubleNewlineIdx !== -1) {
          const firstPara = body.substring(0, firstDoubleNewlineIdx);
          // If the first paragraph doesn't start with '#', it's the "No contact form here" text
          if (!firstPara.startsWith('#')) {
            body = body.replace(firstPara, formHtml);
            
            // Reassemble
            content = '---' + parts[1] + '---\n\n' + body;
            fs.writeFileSync(contactFile, content, 'utf8');
            updatedCount++;
            console.log(`Updated ${contactFile}`);
          }
        }
      }
    }
  }
  
  console.log(`Successfully updated ${updatedCount} files.`);
}

updateContactFiles();
