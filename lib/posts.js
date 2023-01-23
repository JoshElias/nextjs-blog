import { readdir, readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = await readdir(postsDirectory);
    const allPostsData = await Promise.all(
        fileNames.map(async (fileName) => {
            // Remove .md from filename to get id
            const id = fileName.replace(/\.md$/, '');

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = await readFile(fullPath, 'utf8');

            // Use gray-matter to parsethe posts metadata section
            const matterResult = matter(fileContents);

            // Combine the data with the id
            return {
                id,
                ...matterResult.data
            };
        })
    );

    // Sort posts by date
    return allPostsData.sort((a,b) => {
        return (a.date <= b.date) ? 1 : -1;
    });
}