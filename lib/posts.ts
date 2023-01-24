import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import matter from 'gray-matter';

type MatterResultData = {
    date: string,
    title: string
}

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
                ...matterResult.data as MatterResultData
            };
        })
    );

    // Sort posts by date
    return allPostsData.sort((a,b) => {
        return (a.date <= b.date) ? 1 : -1;
    });
}

export async function getAllPostIds() { 
    const fileNames = await readdir(postsDirectory);
    return fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        return { 
            params: { id }
        }
    });
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = await readFile(fullPath, 'utf8');
    
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();
    
    return {
        id,
        contentHtml,
        ...matterResult.data as MatterResultData
    };
}