import { getArticleByGroupId } from '../../../actions/articles';
import { ArticleForm } from '../article-form';

export default async function EditArticlePage({ params }: { params: Promise<{ groupId: string }> }) {
    const { groupId } = await params;
    const result = await getArticleByGroupId(groupId);

    if (!result.success) {
        return (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <p className='text-red-700'>{result.error}</p>
            </div>
        );
    }

    return <ArticleForm article={result.data} />;
}
