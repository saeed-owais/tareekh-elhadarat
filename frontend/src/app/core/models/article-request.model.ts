export interface ArticleRequest {
  title: string;
  content: string;
  image: File;
  categoryId: number;
  articleTagsIds: number[];
}
