import Link from 'next/link';

export default function FirstPost() {
    return (
        <>
            <h1>This is my first post</h1>
            <h2>
                <Link href="/">Back to home</Link>
            </h2>
        </>
    );
}