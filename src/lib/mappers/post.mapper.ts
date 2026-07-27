export interface Post {
  id: number;
  slug: string;
  title: string;
  summary?: string;
  content?: string;
  image?: string;
  createdAt: Date;
  readingTime?: number;
  views?: number;
}

export function mapApiPost(post: any): Post {console.log('post',post)
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    content: post.content,
    image: post.main_image,
    createdAt: new Date(post.created_at),
    readingTime: post.reading_time,
    views: post.views_count,
  };
}
