import fs from 'fs';
import path from 'path';

export interface IconRegistryEntry {
  name: string;
  slug: string;
  description: string;
  tags: string[];
  svgPath: string;
  link?: string;
  credit?: string;
  reference?: string;
}

/**
 * Registry loader that scans the src/icons directory.
 * This should only be called on the server.
 */
export async function getIconRegistry(): Promise<IconRegistryEntry[]> {
  const iconsDir = path.join(process.cwd(), 'icons');
  
  if (!fs.existsSync(iconsDir)) {
    return [];
  }

  const folders = fs.readdirSync(iconsDir).filter((file) => {
    return fs.statSync(path.join(iconsDir, file)).isDirectory();
  });

  const registry: IconRegistryEntry[] = await Promise.all(
    folders.map(async (slug) => {
      const folderPath = path.join(iconsDir, slug);
      const jsonPath = path.join(folderPath, `${slug}.json`);
      const svgPath = path.join(folderPath, `${slug}.svg`);

      // Read metadata
      let metadata = {
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        description: '',
        tags: [] as string[],
      };

      if (fs.existsSync(jsonPath)) {
        try {
          const jsonContent = fs.readFileSync(jsonPath, 'utf8');
          metadata = { ...metadata, ...JSON.parse(jsonContent) };
        } catch (e) {
          console.error(`Error parsing metadata for ${slug}:`, e);
        }
      }

      // Read SVG content
      let svgContent = '';
      if (fs.existsSync(svgPath)) {
        try {
          svgContent = fs.readFileSync(svgPath, 'utf8');
        } catch (e) {
          console.error(`Error reading SVG for ${slug}:`, e);
        }
      }

      return {
        ...metadata,
        svgPath: svgContent,
      };
    })
  );

  return registry;
}

/**
 * Retrieves a single icon registry entry by its slug.
 */
export async function getIconBySlug(slug: string): Promise<IconRegistryEntry | null> {
  const registry = await getIconRegistry();
  return registry.find((icon) => icon.slug === slug) || null;
}
